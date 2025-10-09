package project.web.backend.utils.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import project.web.backend.exceptions.AppException;
import project.web.backend.utils.annotations.EnumPattern;
import project.web.backend.utils.enums.ErrorCode;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class EnumPatternValidator implements ConstraintValidator<EnumPattern, Enum<?>> {
    Pattern pattern;

    @Override
    public void initialize(EnumPattern annotation) {
        try {
            pattern = Pattern.compile(annotation.regexp());
        } catch (PatternSyntaxException e) {
            throw new AppException(ErrorCode.REGEX_INVALID);
        }
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        Matcher matcher = pattern.matcher(value.name());
        return matcher.matches();
    }
}

