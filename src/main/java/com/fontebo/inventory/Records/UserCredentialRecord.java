package com.fontebo.inventory.Records;

import jakarta.validation.constraints.NotNull;

public record UserCredentialRecord(

        @NotNull String userName,
        @NotNull String password) {

}
