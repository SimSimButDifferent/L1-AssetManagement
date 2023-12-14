// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AssetManagement {
    /* structs */

    struct Asset {
        uint256 assetId; // Asset Id to be used as the identifier for the asset.
        int assetValue; // Value of the asset, the owner of the asset will enter.
        bool assetStatus; // Confirms the given asset is stored.
        address assetOwner; // The address of the owner of the given asset.
        string assetDescription; // Owners description of given asset.
    }

    /* mappings */
    mapping(uint256 => Asset) private assets; // Mapping to give asset details using its assetId.

    /* state variables */
    uint256 private lastAssetId; // Counter to keep track of last asset Id.
    bool private lastAssetStatus = false; // last asset status to update status automatically.

    /* functions */

    // A function to register new assets. Takes the asset value and description. Id, status, and owner updated automatically.
    function assetRegistration(
        int _assetValue,
        string memory _assetDescription
    ) public {
        if (_assetValue < 0) {
            // Throws an error if value is not above zero, otherwise sets status to true.
            revert("Asset value must be above zero");
        }

        lastAssetId++; // Adds 1 to addressId counter
        Asset memory newAsset = Asset(
            lastAssetId,
            _assetValue,
            lastAssetStatus,
            msg.sender,
            _assetDescription
        ); // Creates a new asset
        assets[lastAssetId] = newAsset; // Adds new asset to assets mapping, using the new asset Id.
    }

    // A function that updates exisitng assets.
    function updateAsset(
        uint256 _assetId,
        int _assetValue,
        string memory _assetDescription
    ) public {
        if (assets[_assetId].assetStatus != true) {
            revert("Asset does not exist");
        }

        require(
            assets[_assetId].assetOwner == msg.sender,
            "Caller is not asset owner"
        );

        Asset memory updatedAsset = Asset(
            _assetId,
            _assetValue,
            true,
            msg.sender,
            _assetDescription
        ); // Creates an updated asset.
        assets[_assetId] = updatedAsset; // Adds updated asset to asset mapping.
    }

    /* getter functions */

    // Gets an asset using its assetId
    function getAsset(uint256 assetId) public view returns (Asset memory) {
        return assets[assetId];
    }
}
