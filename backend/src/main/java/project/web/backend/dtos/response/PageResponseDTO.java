package project.web.backend.dtos.response;


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
    private T data;
}
