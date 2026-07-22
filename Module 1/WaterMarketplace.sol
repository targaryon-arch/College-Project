// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title WaterMarketplace
/// @notice Optional escrow-based marketplace so farmers can sell surplus water
///         tokens at a price they set, instead of a bare wallet-to-wallet transfer.
/// @dev Tokens are held in escrow by this contract from the moment a listing is
///      created, so a seller can't double-sell or spend tokens out from under
///      an active listing.
contract WaterMarketplace is ReentrancyGuard {
    IERC20 public immutable waterToken;

    struct Listing {
        address seller;
        uint256 amount;        // tokens remaining in this listing
        uint256 pricePerToken; // price in wei, per token
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerToken);
    event Purchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPaid);
    event Cancelled(uint256 indexed listingId, address indexed seller, uint256 amountReturned);

    constructor(address _waterToken) {
        waterToken = IERC20(_waterToken);
    }

    /// @notice Lists water tokens for sale. Caller must have approved this
    ///         contract to spend `amount` tokens first (ERC20 approve()).
    function createListing(uint256 amount, uint256 pricePerToken) external returns (uint256 listingId) {
        require(amount > 0, "Amount must be > 0");
        require(pricePerToken > 0, "Price must be > 0");
        require(waterToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        listingId = nextListingId++;
        listings[listingId] = Listing({
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });

        emit Listed(listingId, msg.sender, amount, pricePerToken);
    }

    /// @notice Buys `amount` tokens from an active listing, paying in ETH.
    ///         Supports partial fills; overpayment is refunded.
    function buy(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(amount > 0 && amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = amount * listing.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");

        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
        }

        require(waterToken.transfer(msg.sender, amount), "Token transfer failed");

        (bool sentToSeller, ) = listing.seller.call{value: totalPrice}("");
        require(sentToSeller, "Payment to seller failed");

        if (msg.value > totalPrice) {
            (bool refunded, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refunded, "Refund failed");
        }

        emit Purchased(listingId, msg.sender, amount, totalPrice);
    }

    /// @notice Cancels a listing and returns any remaining escrowed tokens to the seller.
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        uint256 amountToReturn = listing.amount;
        listing.active = false;
        listing.amount = 0;

        require(waterToken.transfer(msg.sender, amountToReturn), "Token refund failed");
        emit Cancelled(listingId, msg.sender, amountToReturn);
    }
}
