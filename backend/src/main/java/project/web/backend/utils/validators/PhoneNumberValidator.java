package project.web.backend.utils.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import project.web.backend.exceptions.AppException;
import project.web.backend.utils.annotations.PhoneNumber;
import project.web.backend.utils.enums.ErrorCode;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumber, String> {
    Pattern pattern;
    private static String regex = "^[0-9\\-\\+]{9,15}$";

    @Override
    public void initialize(PhoneNumber annotation) {
        try {
            pattern = Pattern.compile(regex);
        } catch (PatternSyntaxException e) {
            throw new AppException(ErrorCode.REGEX_INVALID);
        }
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        Matcher matcher = pattern.matcher(value);
        return matcher.matches();
    }
}
