const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Função para ler o arquivo JSON
function getData() {
    const data = fs.readFileSync('./cursos.json', 'utf-8');
    return JSON.parse(data);
}

// Endpoint para buscar curso por nome
app.get('/curso', (req, res) => {
    const nomeCurso = req.query.nome;
    const data = getData();

    // Procurar o curso pelo nome
    const curso = data.Cursos.find(curso => curso.Nome.toLowerCase() === nomeCurso.toLowerCase());

    if (curso) {
        res.json(curso);
    } else {
        res.status(404).send({ message: 'Curso não encontrado' });
    }
});

// Endpoint para buscar atividades de uma aula específica de um curso
app.get('/atividades', (req, res) => {
    const nomeCurso = req.query.nome;
    const nomeAula = req.query.aula;
    const data = getData();

    // Procurar o curso pelo nome
    const curso = data.Cursos.find(curso => curso.Nome.toLowerCase() === nomeCurso.toLowerCase());

    if (!curso) {
        return res.status(404).send({ message: 'Curso não encontrado' });
    }

    // Procurar a aula dentro do curso
    const aula = data.Aulas.find(aula => aula.Título.toLowerCase() === nomeAula.toLowerCase() && aula.idCurso === curso.id);

    if (!aula) {
        return res.status(404).send({ message: 'Aula não encontrada' });
    }

    // Procurar as atividades da aula
    const atividades = data.Atividades.filter(atividade => atividade.idAula === aula.id);

    res.json(atividades);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
