package com.example.backend.base;

import java.util.List;

public interface PageableResource {
    int getPage(); //현재 몇페이지 인지.
    void setPage(int page);

    int getTotalPages();
    void setTotalPages(int totalPage);

    List<? extends IEntity> getContents();
    void  setContents(List<? extends IEntity> contents);

    String getMessage();
    void setMessage(String message);
}
