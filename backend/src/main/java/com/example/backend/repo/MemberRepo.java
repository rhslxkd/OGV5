package com.example.backend.repo;

import com.example.backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepo extends JpaRepository<Member, String> {//JpaRepositroy를 extends함으로써 CRUD를 만들기 위한 기본요소(GET, insert, selectById등과 같은 기능을 구현할 수 있게 해줌
//    @Query("select me from Member me order by me.id asc")
    boolean existsById(String id);

}
