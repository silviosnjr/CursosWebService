const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Função para ler o arquivo JSON
function getData() {
    const dataPath = path.join(__dirname, 'base_dados_cursos.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
}

// Endpoint para buscar curso por nome, listar aulas ou listar atividades
app.get('/curso', (req, res) => {
    const nomeCurso = req.query.nome;
    const aulaNumero = req.query.aula;
    const listarInstrutores = req.query.instrutor;
    const listarAulas = req.query.aulas;
    const data = getData();

    // Procurar o curso pelo nome
    const curso = data.Cursos.find(curso => curso.Nome.toLowerCase() === nomeCurso.toLowerCase());

    if (!curso) {
        return res.status(404).send({ message: 'Curso não encontrado' });
    }

    // Se o parâmetro 'aulas=all' for passado, retornar as aulas do curso
    if (listarAulas === 'all') {
        const aulas = data.Aulas.filter(aula => aula.idCurso === curso.id);
        if (aulas.length > 0) {
            return res.json(aulas);
        } else {
            return res.status(404).send({ message: 'Nenhuma aula encontrada para este curso' });
        }
    }

    // Se o parâmetro 'aula' for passado, retornar as atividades da aula correspondente
    if (aulaNumero) {
        //const aula = data.Aulas.find(aula => aula.Numero === aulaNumero && aula.idCurso === curso.id);
        const aula = data.Aulas.find(aula => aula.Numero === aulaNumero);

        if (!aula) {
            return res.status(404).send({ message: 'Aula não encontrada.' });
        }

        // Procurar as atividades da aula
        const atividades = data.Atividades.filter(atividade => atividade.idAula === aula.id);

        if (atividades.length > 0) {
            return res.json(atividades);
        } else {
            return res.status(404).send({ message: 'Nenhuma atividade encontrada para esta aula' });
        }
    }

     // Se o parâmetro 'instrutor=all' for passado, retornar os detalhes dos instrutores do curso
     if (listarInstrutores === 'all') {
        const instrutoresNomes = curso.Instrutor.split(', ').map(instrutor => instrutor.trim());
        
        // Procurar os registros completos dos instrutores no arquivo JSON
        const instrutoresDetalhes = data.Instrutores.filter(instrutor =>
            instrutoresNomes.includes(instrutor.nome)
        );

        if (instrutoresDetalhes.length > 0) {
            return res.json(instrutoresDetalhes);
        } else {
            return res.status(404).send({ message: 'Nenhum instrutor encontrado para este curso' });
        }
    }

    // Caso não seja passado 'aulas' ou 'aula', retornar o curso completo
    res.json(curso);
});

// Novo endpoint para buscar instrutor por nome
app.get('/instrutor', (req, res) => {
    const nomeInstrutor = req.query.nome;
    const data = getData();

    const instrutor = data.Instrutores.find(instrutor => instrutor.nome.toLowerCase() === nomeInstrutor.toLowerCase());

    if (!instrutor) {
        return res.status(404).send({ message: 'Instrutor não encontrado' });
    }
    
    res.json(instrutor);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});