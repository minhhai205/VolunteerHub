package project.web.backend.utils.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import project.web.backend.utils.validators.EnumPatternValidator;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Constraint(validatedBy = EnumPatternValidator.class)
public @interface EnumPattern {
    String name();

    String regexp();

    String message() default "{name} must match {regexp}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
