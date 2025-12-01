package project.web.backend.dtos.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponseDTO<T> implements Serializable {
    private int pageNo;
    private int pageSize;
    private int totalPage;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long total;
    private T data;
}
