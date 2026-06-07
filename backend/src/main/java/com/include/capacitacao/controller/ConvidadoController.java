package com.include.capacitacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.include.capacitacao.model.Convidado;
import com.include.capacitacao.service.ConvidadoService;

@RequestMapping("/convidados")
@RestController
public class ConvidadoController {

    @Autowired
    private ConvidadoService convidadoService;

    @GetMapping
    public List<Convidado> listarConvidados() {
        return convidadoService.listarConvidados();
    }

    @PostMapping
    public Convidado salvarConvidado(@RequestBody Convidado convidado) {
        return convidadoService.salvarConvidado(convidado);
    }
}
