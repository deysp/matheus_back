import bcrypt from 'bcrypt'

export async function CriarHash(senha, salts) {
    //Trasnformando a senha de texto para hash
    const hash = await bcrypt.hash(senha, salts);
    return hash
}

export async function CompararHash(password, hash) {
    //Compara a senha original com o hash salvo
    const teste = await bcrypt.compare(password, hash)
    if(teste){
        console.log('Senha correta!')
        return true
    }
    else {
        console.log('Senha incorreta!')
        return false
    }
}

    // CriarHash('62902072*', saltRounds)

// let teste = await CriarHash('62902072*', saltRounds)
// CompararHash('admins', teste)