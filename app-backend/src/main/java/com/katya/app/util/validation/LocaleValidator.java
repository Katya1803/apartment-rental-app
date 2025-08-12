package com.katya.app.util.validation;

import com.katya.app.util.enums.Locale;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class LocaleValidator implements ConstraintValidator<ValidLocale, String> {

    @Override
    public void initialize(ValidLocale constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Let @NotNull handle null values
        }

        try {
            Locale.fromCode(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}