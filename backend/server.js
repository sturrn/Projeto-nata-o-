const express = require("express");
const cors = require("cors");
const mysql = require ("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password : process.env.DB_PASSWORD || "",
    database : process.env.DB_NAME || "natacao",
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_HOST ? {
        rejectUnauthorized: false} : null
});

db.connect((erro) => {
    if(erro){
        console.log("Erro ao conectar");
        console.log(erro);
        return;
    }
    console.log("Conectado com sucesso");
    const criartabelaSQL = `
    CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone INT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    horario VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
    );
    `;
    db.query(criartabelaSQL, (erroTabela) => {
        if (erroTabela) {
            console.log("Erro de verificação ou criação da tabela", erroTabela);
        } else {
            console.log("Tabela pronta para uso");
        }
    })
});

app.get("/", (req, res) => {
    res.json({
        mensagem: "API funcionando"
    })
})
 
app.post("/alunos", (req,res) => {
    const {
        nome, idade, nivel, horario
    } = req.body
 
    if (!nome || !idade || !nivel || !horario) {
        return res.status(400).json({
            erro: "Preencha todos os campos."
        })
    } 
 
        if (idade < 5) {
            return res.status(400).json({
                erro: "Aluno abaixo da idade permitida."
            })
        }
 
        const verificaSQL = "SELECT * FROM alunos WHERE nome = ?"
        db.query(verificaSQL, [nome], (erro, resultados) => {
            if(erro){
                return res.status(500).json(erro);
            }
        if (resultados.length > 0) {
            return res.status(400).json({
                erro: "Já existe um aluno com este nome"
            });
        }
        const insertSQL = "INSERT INTO alunos (id, nome, idade, nivel, horario, ativo) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertSQL, [novoAluno.id, novoAluno.nome, novoAluno.idade, novoAluno.nivel, novoAluno.horario, novoAluno.ativo], (erro, resultados) => {
            if(erro){
                return res.status(500).json(erro);
            }
           if (resultados.length > 0) {
            return res.status(400).json({
                erro: "Erro ao cadastrar aluno."
            })
        }
         const insertSQL = "INSERT INTO alunos (id, nome, idade, nivel, horario, ativo) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertSQL, [nome, idade, nivel, horario, ativo], (erro,resultado) => {
            if(erro){ 
                return res.status(500).json(erro);
            }
            res.status(201).json({
                mensagem: "Aluno cadastrado com sucesso!",
                id: resultado.insertId
            });
        });
    });
});
 
    app.get("/alunos", (req,res) => {
    db.query(
        "SELECT * FROM alunos", (erro, resultados) => 
            {
            if(erro){
                return res.status(500).json(erro);
            }
            res.json(resultados);
        }
    );
})
        app.delete("/alunos/:id", (req,res) => {
            const id = req.params.id
        db.query("DELETE FROM alunos where id=?", [id],(erro, resultados) => {
            if(erro){
                return res.status(500).json(erro);
            }
            if (resultados.affectedRows === 0) {
                return res.status(404).json({
                    erro:"Aluno não encontrado"
                })
            }
            res.json({
                mensagem: "Aluno removido"
            })
        });

    })
 
    app.put("/alunos/:id", (req,res) => {
        const id = (req.params.id)
        db.query("SELECT ativos FROM alunos WHERE id=?", [id], (erro, resultados) => {
       if(erro){
        return res.status(500).json(erro);
       }
       if(resultados.length === 0){
        return res.status(404).json({
            erro:"Aluno não encontrado"
        });
       }
         const novoStatus =
         resultados[0].ativo === 1 ? 0 : 1;
         db.query("UPDATE alunos SET ativo=? WHERE id=?", [novoStatus, id], (erro) => {
            if(erro){
                return res.status(500).json(erro);
            }
            res.json({
                mensagem: "Status do aluno atualizado"
            });
         });
    })
});
 
     let incorretas=0
     let bloqueado= false

    app.post ("/admin", (req, res) => {
        const {senha} = req.body;
        
        if(bloqueado===true){
            return res.status(403).json({
                erro:"muitas tentativas. sistema bloqueado"
            });
        }
 
        if(!senha) {
            return res.status(400).json({
                erro: "informe a senha."
            })
        }
 
        if(senha === "admin123") {
            incorretas=0
            return res.json({autenticado: true});
        }
        incorretas++;
        if(incorretas>=3){
            bloqueado=true;
            return res.status(403).json({
                erro:"sistema bloqueado"
            })
        }


        return res.status(401).json({
            erro: `Senha incorreta. Faltam ${3-incorretas} ate o sistema bloquear`
        });
    });

 const PORT = process.env.PORT||3000;
    app.listen(PORT, () => {
        console.log("Servidor rodando em: ")
        console.log(`porta ${PORT}`)
        })       
    })         
