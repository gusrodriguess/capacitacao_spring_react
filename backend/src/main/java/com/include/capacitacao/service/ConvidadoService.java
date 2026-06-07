package com.include.capacitacao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.include.capacitacao.model.Convidado;
import com.include.capacitacao.repository.ConvidadoRepository;

@Service
public class ConvidadoService {
    
    @Autowired
    private ConvidadoRepository convidadoRepository;

    public List<Convidado> listarConvidados() {
        return convidadoRepository.findAll();
    }

    public Convidado salvarConvidado(Convidado convidado) {
        return convidadoRepository.save(convidado);
    }
}
