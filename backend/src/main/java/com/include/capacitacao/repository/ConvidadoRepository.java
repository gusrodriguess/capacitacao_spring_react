package com.include.capacitacao.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.include.capacitacao.model.Convidado;

@Repository
public interface ConvidadoRepository extends JpaRepository<Convidado, Long> {
    
}
