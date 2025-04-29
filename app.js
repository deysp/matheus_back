import express from "express";
import cors from "cors";
import sql from './database.js'
import { CompararHash, CriarHash } from "./utils.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await sql`
            SELECT email, senha, funcao 
            FROM aluno 
            WHERE email = ${email}`;

        if (usuario.length === 0) {
            return res.status(401).json('Usuário ou senha incorretos');
        }

        const senhaCorreta = await CompararHash(senha, usuario[0].senha);

        if (!senhaCorreta) {
            return res.status(401).json('Usuário ou senha incorretos');
        }

        return res.status(200).json(usuario[0]);
    } catch (error) {
        return res.status(500).json('Erro ao fazer o login');
    }
});

app.post('/aluno/novo', async (req, res) => {
    try {

        const { nome, senha, email } = req.body;
        const hash = await CriarHash(senha, 10)
        console.log(hash)

        const teste = await sql`insert into aluno
        (nome, senha, email, funcao)    
        values(${nome},${hash},${email},'aluno')`
        return res.status(200).json('ok')
    }
    catch (error) {
        if (error.code == 23505) {
            return res.status(400).json('Email ja cadastrado!')
        }
        return res.status(500).json('Erro ao cadastrar usuario!')
    }
});

app.get('/quiz/pergunta', async (req, res) => {
    try {
        const { questao, opcao1, opcao2, opcao3, opcao4, correta, dificuldade } = req.body;
        await sql
            `INSERT INTO perguntas (questao, opcao1, opcao2, opcao3, opcao4, correta, dificuldade) VALUES
            (${questao}, ${opcao1}, ${opcao2}, ${opcao3}, ${opcao4}, ${correta}, ${dificuldade})`

        res.status(200).json('Pergunta adicionada com sucesso!');
    } catch (error) {
        res.status(500).json('Erro ao enviar a pergunta');
    }
});

app.post('/quiz/responder', async (req, res) => {
    try {
        
        const { resposta } = req.body;
        const consulta = await sql
            `SELECT * FROM perguntas ORDER BY RANDOM(LIMIT 40);`

        if (consulta.rows.length > 0 && consulta.rows[0].correta === resposta) {
            return res.status(200).json(consulta);
        } else {
            return res.status(401).json('Resposta incorreta, tente novamente!');
        }
    } catch (error) {
        console.log(error)
        res.status(500).json('Erro ao validar resposta');
    }
});



app.listen(8080, () => {
    console.log('Running!!')
});