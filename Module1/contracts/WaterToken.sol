// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title WaterToken
/// @notice Represents allocated water credits for farmers. 1 token = 1 unit of water
///         (define the real-world unit, e.g. 1000 liters, at the project level).
/// @dev Minting and deduction are gated behind roles so different real-world actors
///      (irrigation authority vs. smart water meters) can be given only the
///      permission they need.
contract WaterToken is ERC20, AccessControl {
    /// @notice Can allocate new season tokens to farmers.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Can deduct tokens when water is actually used (e.g. called by a
    ///         trusted meter/oracle wallet).
    bytes32 public constant DEDUCTOR_ROLE = keccak256("DEDUCTOR_ROLE");

    event WaterAllocated(address indexed farmer, uint256 amount, uint256 season);
    event WaterUsed(address indexed farmer, uint256 amount, string meterReading);

    /// @param admin Address that will hold DEFAULT_ADMIN_ROLE, MINTER_ROLE and
    ///        DEDUCTOR_ROLE at deployment. In production you'd likely transfer
    ///        DEDUCTOR_ROLE to a separate oracle/meter wallet after deployment.
    constructor(address admin) ERC20("WaterCredit", "H2O") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(DEDUCTOR_ROLE, admin);
    }

    /// @dev Whole-number tokens only — water allocations don't need fractional cents.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    /// @notice Gives a single farmer their allocated tokens at the start of a season.
    function allocateSeasonTokens(
        address farmer,
        uint256 amount,
        uint256 season
    ) external onlyRole(MINTER_ROLE) {
        require(farmer != address(0), "Invalid farmer address");
        require(amount > 0, "Amount must be > 0");

        _mint(farmer, amount);
        emit WaterAllocated(farmer, amount, season);
    }

    /// @notice Gas-efficient way to allocate tokens to many farmers at once
    ///         (e.g. the whole village at the start of the season).
    function batchAllocate(
        address[] calldata farmers,
        uint256[] calldata amounts,
        uint256 season
    ) external onlyRole(MINTER_ROLE) {
        require(farmers.length == amounts.length, "Array length mismatch");

        for (uint256 i = 0; i < farmers.length; i++) {
            require(farmers[i] != address(0), "Invalid farmer address");
            require(amounts[i] > 0, "Amount must be > 0");
            _mint(farmers[i], amounts[i]);
            emit WaterAllocated(farmers[i], amounts[i], season);
        }
    }

    /// @notice Securely removes tokens from a farmer's balance when water is used.
    /// @param meterReading Free-text reference (e.g. meter ID + timestamp) so the
    ///        on-chain event ties back to the physical reading that triggered it.
    function deductUsage(
        address farmer,
        uint256 amount,
        string calldata meterReading
    ) external onlyRole(DEDUCTOR_ROLE) {
        require(balanceOf(farmer) >= amount, "Insufficient water tokens");

        _burn(farmer, amount);
        emit WaterUsed(farmer, amount, meterReading);
    }

    // Peer-to-peer trading is handled by the inherited ERC20 transfer() and
    // transferFrom() functions — no extra code needed for a basic wallet-to-wallet
    // trade. See WaterMarketplace.sol for an optional priced marketplace.
}
