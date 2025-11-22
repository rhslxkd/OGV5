package com.example.backend.base;


import lombok.Data;

import java.util.List;

@Data
public class PageableResourceImpl implements PageableResource {

    int page = 1;

    int totalPages;

    List<? extends IEntity> contents;

    String message;

    public PageableResourceImpl() {}
    public PageableResourceImpl(List<? extends  IEntity> contents,
                                int page, int totalPages) {
        this.contents = contents;
        this.page = page;
        this.totalPages = totalPages;

    }
}
