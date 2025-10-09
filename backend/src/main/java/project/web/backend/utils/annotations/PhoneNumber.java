package project.web.backend.utils.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import project.web.backend.utils.validators.PhoneNumberValidator;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Constraint(validatedBy = PhoneNumberValidator.class)
public @interface PhoneNumber {
    String message() default "{name} must match {regexp}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
