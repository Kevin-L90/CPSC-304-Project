package app.repository;

import org.springframework.stereotype.Repository;

import java.lang.annotation.Annotation;

@Repository
public class CardRepository implements Repository {

    @Override
    public String value() {
        return null;
    }

    @Override
    public Class<? extends Annotation> annotationType() {
        return null;
    }
}