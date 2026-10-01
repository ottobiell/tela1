// Importa as bibliotecas
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // 1. Corrigido para mysql2
const multer = require('multer');
const path = require('path');


const app = express();


// Middlewares essenciais
app.use(cors()); // 2. Ativado o CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve a pasta de uploads estaticamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 3. Adicionada a barra '/'


// Configuração do banco de dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    database: 'cadastro',
    port: 3306,
});


// Configuração do multer (onde serão salvas as imagens)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Salva na pasta uploads
    },
    filename: (req, file, cb) => {
        // Renomeia o ficheiro para evitar duplicados
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


// 4. Instância do multer criada
const upload = multer({ storage });


// Rota de cadastro de pet
app.post('/api/pets', upload.single('imagem'), async (req, res) => { // 5. Corrigido '/api/pets' e 'upload.single'
    const { tutor, nome_pet, raca, genero, peso, idade } = req.body;
    const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;


    // Verifica se os campos obrigatórios foram preenchidos
    if (!tutor || !nome_pet || !raca || !genero || !peso || !idade || !req.file) {
        return res.status(400).json({ message: 'Todos os campos e a imagem são obrigatórios.' });
    }


    try {
        // 6. Corrigido 'INSERT INTO'
        const query = `
            INSERT INTO pets (tutor, nome_pet, raca, genero, peso, idade, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        await db.query(query, [tutor, nome_pet, raca, genero, peso, idade, imagem_url]);


        return res.status(201).json({ message: 'Pet cadastrado com sucesso.' });


    } catch (error) {
        console.error('Erro ao salvar pet:', error);
        return res.status(500).json({ message: 'Erro ao salvar no banco de dados.' });
    }
});


// 7. Inicialização do servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a executar na porta ${PORT}`);
});
