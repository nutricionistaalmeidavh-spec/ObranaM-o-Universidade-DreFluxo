import { withCompetencyGuidance } from './content-guidance';

type YoungAdultVariant={skill:'leitura'|'compreensao'|'escrita'|'adicao'|'multiplicacao'|'porcentagem';level:'N1'|'N2'|'N3'|'N4'|'N5';topic:string;prompt:string;answer:string;kind:'choice'|'short-text'|'text';options:string[];accept:string[];source:string};
const RAW:YoungAdultVariant[]=[
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Complete a palavra com a letra que falta: _ASA.",
    "answer": "C",
    "kind": "short-text",
    "options": [],
    "accept": [
      "C"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Complete: _ATO.",
    "answer": "G",
    "kind": "short-text",
    "options": [],
    "accept": [
      "G"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Circule mentalmente as vogais da palavra TRABALHO e escreva apenas as vogais.",
    "answer": "A, A, O",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A, A, O"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Quantas sílabas há na palavra CASA?",
    "answer": "2",
    "kind": "short-text",
    "options": [],
    "accept": [
      "2"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Separe em sílabas: MERCADO.",
    "answer": "MER-CA-DO",
    "kind": "short-text",
    "options": [],
    "accept": [
      "MER-CA-DO"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Junte as sílabas e forme uma palavra: PA + TO.",
    "answer": "PATO",
    "kind": "short-text",
    "options": [],
    "accept": [
      "PATO"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Junte as sílabas e forme uma palavra: CA + FÉ.",
    "answer": "CAFÉ",
    "kind": "short-text",
    "options": [],
    "accept": [
      "CAFÉ"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra começa com a mesma letra de MESA?",
    "answer": "mala",
    "kind": "choice",
    "options": [
      "mala",
      "casa",
      "rua"
    ],
    "accept": [
      "a) mala",
      "mala"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra rima com PATO?",
    "answer": "gato",
    "kind": "choice",
    "options": [
      "mesa",
      "gato",
      "livro"
    ],
    "accept": [
      "b) gato",
      "gato"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra rima com MÃO?",
    "answer": "pão",
    "kind": "choice",
    "options": [
      "pão",
      "sala",
      "dedo"
    ],
    "accept": [
      "a) pão",
      "pão"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva a palavra em letras minúsculas: CASA.",
    "answer": "casa",
    "kind": "short-text",
    "options": [],
    "accept": [
      "casa"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva a palavra em letras maiúsculas: trabalho.",
    "answer": "TRABALHO",
    "kind": "short-text",
    "options": [],
    "accept": [
      "TRABALHO"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Quantas letras há na palavra LOBO?",
    "answer": "4",
    "kind": "short-text",
    "options": [],
    "accept": [
      "4"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Quantas vogais há na palavra LOBO?",
    "answer": "2",
    "kind": "short-text",
    "options": [],
    "accept": [
      "2"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Qual sinal deve aparecer no final da pergunta: \"Você chegou cedo__\"",
    "answer": "?",
    "kind": "short-text",
    "options": [],
    "accept": [
      "?"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Qual sinal deve aparecer no final da afirmação: \"A reunião começou cedo__\"",
    "answer": ".",
    "kind": "short-text",
    "options": [],
    "accept": [
      "."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Leia: \"Ana chegou cedo.\" Quem chegou cedo?",
    "answer": "Ana",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Ana"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Leia: \"Paulo abriu a porta.\" O que Paulo abriu?",
    "answer": "A porta",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A porta"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Leia: \"A loja fecha às seis.\" O que fecha às seis?",
    "answer": "A loja",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A loja"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "leitura",
    "level": "N1",
    "topic": "PORTUGUÊS",
    "prompt": "Coloque as palavras em ordem alfabética: casa, aviso, banco.",
    "answer": "aviso, banco, casa",
    "kind": "short-text",
    "options": [],
    "accept": [
      "aviso, banco, casa"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Que tipo de texto é esse?",
    "answer": "Aviso",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Aviso"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Em que dia a biblioteca ficará fechada?",
    "answer": "Sexta-feira",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Sexta-feira"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Por que ela ficará fechada?",
    "answer": "Para organização do acervo",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Para organização do acervo"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Quando o atendimento será retomado?",
    "answer": "Na segunda-feira",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Na segunda-feira"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Qual mensagem central aparece no aviso sobre os galhos?",
    "answer": "b",
    "kind": "choice",
    "options": [
      "compra de livros",
      "fechamento temporário da biblioteca",
      "mudança de endereço"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "A palavra \"Ele\" substitui qual nome?",
    "answer": "Marcos",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Marcos"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "O que Marcos organizou?",
    "answer": "Os documentos",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Os documentos"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "O que aconteceria depois da organização dos documentos?",
    "answer": "Uma reunião",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Uma reunião"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Reescreva corretamente: \"marcos chegou cedo.\"",
    "answer": "Marcos chegou cedo.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Marcos chegou cedo."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Reescreva corretamente: \"a reunião começou. ela terminou às dez.\"",
    "answer": "A reunião começou. Ela terminou às dez.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A reunião começou. Ela terminou às dez."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Complete com M, N ou til: ca__po.",
    "answer": "campo",
    "kind": "short-text",
    "options": [],
    "accept": [
      "campo"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Complete com M, N ou til: ma__hã.",
    "answer": "manhã",
    "kind": "short-text",
    "options": [],
    "accept": [
      "manhã"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Complete com M, N ou til: irmã__.",
    "answer": "irmã",
    "kind": "short-text",
    "options": [],
    "accept": [
      "irmã"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra tem sentido mais próximo de \"avisar\"?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "comunicar",
      "esconder",
      "esquecer"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Qual título combina melhor com a frase \"O ônibus atrasou por causa do trânsito\"?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "Atraso no transporte",
      "Receita do dia",
      "Novo emprego"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Passe para o plural: \"O documento importante.\"",
    "answer": "Os documentos importantes.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Os documentos importantes."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Passe para o singular: \"As portas abertas.\"",
    "answer": "A porta aberta.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A porta aberta."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Complete corretamente: \"Os funcionários ______ cedo.\"",
    "answer": "b",
    "kind": "choice",
    "options": [
      "chegou",
      "chegaram"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Complete corretamente: \"A funcionária ______ cedo.\"",
    "answer": "a",
    "kind": "choice",
    "options": [
      "chegou",
      "chegaram"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N2",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva uma frase curta usando a palavra \"aviso\".",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal. Critério: frase completa, compreensível e com uso adequado da palavra."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Qual ideia principal aparece no relato sobre os galhos?",
    "answer": "A retirada/organização de galhos após uma chuva forte",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A retirada/organização de galhos após uma chuva forte"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "O que provocou o problema?",
    "answer": "Uma chuva forte",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Uma chuva forte"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "O que caiu na rua?",
    "answer": "Galhos de árvores",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Galhos de árvores"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Quem ajudou a organizar a passagem?",
    "answer": "Moradores",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Moradores"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Quando os moradores ajudaram?",
    "answer": "Pela manhã",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Pela manhã"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Para que esse texto foi escrito?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "informar",
      "ensinar uma receita",
      "vender um produto"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "A expressão \"equipe responsável pela limpeza\" se refere a pessoas que fariam o quê?",
    "answer": "Fazer a limpeza/retirar os galhos",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Fazer a limpeza/retirar os galhos"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Dê outro título adequado ao texto.",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal coerente com o assunto"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "A palavra \"Ela\" retoma qual palavra?",
    "answer": "Carla",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Carla"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "A palavra \"o\", em \"o entregou\", retoma qual expressão?",
    "answer": "o documento",
    "kind": "short-text",
    "options": [],
    "accept": [
      "o documento"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Reescreva no plural: \"A funcionária recebeu o comunicado.\"",
    "answer": "As funcionárias receberam os comunicados.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "As funcionárias receberam os comunicados."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Reescreva no singular: \"Os funcionários organizaram os documentos.\"",
    "answer": "O funcionário organizou o documento.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "O funcionário organizou o documento."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Complete: \"As salas estavam ______.\"",
    "answer": "b",
    "kind": "choice",
    "options": [
      "organizado",
      "organizadas"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Complete: \"O arquivo estava ______.\"",
    "answer": "a",
    "kind": "choice",
    "options": [
      "organizado",
      "organizadas"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra é mais adequada para substituir \"problema\" sem alterar muito o sentido?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "dificuldade",
      "festa",
      "descanso"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Organize em ordem alfabética: reunião, aviso, documento, cadastro.",
    "answer": "aviso, cadastro, documento, reunião",
    "kind": "short-text",
    "options": [],
    "accept": [
      "aviso, cadastro, documento, reunião"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Leia: \"O portão estava fechado, por isso João procurou outra entrada.\" O que significa \"por isso\" nesse contexto?",
    "answer": "Indica consequência",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Indica consequência"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Leia: \"O ônibus estava lotado, mas chegou no horário.\" A palavra \"mas\" indica:",
    "answer": "a",
    "kind": "choice",
    "options": [
      "contraste",
      "causa",
      "lugar"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva uma frase usando \"ele\" ou \"ela\" para evitar a repetição de um nome.",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal. Critério: pronome deve retomar claramente o nome mencionado."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "compreensao",
    "level": "N3",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva duas frases sobre uma situação do cotidiano, usando uma palavra que conecte as ideias: \"mas\", \"por isso\" ou \"depois\".",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal. Critério: duas frases coerentes e uso adequado do conectivo."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Quem é o personagem principal?",
    "answer": "Roberto",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Roberto"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Em que período do dia ocorre a situação?",
    "answer": "Manhã",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Manhã"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Qual foi o problema inicial?",
    "answer": "Ele havia esquecido a carteira",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Ele havia esquecido a carteira"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "O que Roberto fez para resolver o problema?",
    "answer": "Voltou para casa, pegou o documento/carteira e retornou ao ponto",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Voltou para casa, pegou o documento/carteira e retornou ao ponto"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "O ônibus já havia passado quando ele voltou ao ponto?",
    "answer": "Não",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Não"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "O texto está narrado em primeira ou terceira pessoa?",
    "answer": "Terceira pessoa",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Terceira pessoa"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Cite uma palavra ou expressão que indique tempo.",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Exemplos: \"Naquela manhã\", \"mais cedo\", \"quando\""
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "O verbo \"saiu\" está no:",
    "answer": "b",
    "kind": "choice",
    "options": [
      "presente",
      "passado",
      "futuro"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Passe para o presente: \"Roberto voltou rapidamente.\"",
    "answer": "Roberto volta rapidamente.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Roberto volta rapidamente."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Passe para o futuro: \"Roberto pega o documento.\"",
    "answer": "Roberto pegará o documento. / Roberto vai pegar o documento.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Roberto pegará o documento. / Roberto vai pegar o documento."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Complete corretamente: \"As carteiras estavam ______.\"",
    "answer": "b",
    "kind": "choice",
    "options": [
      "organizado",
      "organizadas"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Complete corretamente: \"Os documentos estavam ______.\"",
    "answer": "a",
    "kind": "choice",
    "options": [
      "corretos",
      "correta"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Qual palavra pode substituir \"rapidamente\" sem mudar muito o sentido?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "depressa",
      "nunca",
      "longe"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Qual é a função de um título em um texto?",
    "answer": "Apresentar/antecipar o assunto e atrair/orientar o leitor",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Apresentar/antecipar o assunto e atrair/orientar o leitor"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Escolha o título mais adequado para o texto:",
    "answer": "a",
    "kind": "choice",
    "options": [
      "Um esquecimento antes do ônibus",
      "Uma receita de almoço",
      "A construção de uma ponte"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Coloque em ordem alfabética: carteira, casa, caminho, cadastro.",
    "answer": "cadastro, caminho, carteira, casa",
    "kind": "short-text",
    "options": [],
    "accept": [
      "cadastro, caminho, carteira, casa"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Escolha a grafia adequada para completar a frase.",
    "answer": "b",
    "kind": "choice",
    "options": [
      "ja",
      "já"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Qual grafia completa corretamente a frase apresentada?",
    "answer": "a",
    "kind": "choice",
    "options": [
      "pó",
      "po"
    ],
    "accept": [
      "a"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Reescreva evitando repetição: \"Roberto pegou a carteira. Roberto colocou a carteira no bolso.\"",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Exemplo: Roberto pegou a carteira. Ele a colocou no bolso."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "escrita",
    "level": "N4",
    "topic": "PORTUGUÊS",
    "prompt": "Escreva um final alternativo de 3 a 4 frases para a situação.",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal. Critério: 3 a 4 frases, sequência lógica e relação com o texto."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Qual era o serviço programado?",
    "answer": "Manutenção na rede de água",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Manutenção na rede de água"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Em que dia ele ocorreria?",
    "answer": "Sábado",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Sábado"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "O que alguns moradores fizeram antes da manutenção?",
    "answer": "Guardaram água com antecedência",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Guardaram água com antecedência"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "O serviço terminou no horário previsto?",
    "answer": "Não",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Não"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Quanto tempo a mais ele durou?",
    "answer": "Duas horas",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Duas horas"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Quando o abastecimento voltou ao normal?",
    "answer": "À tarde",
    "kind": "short-text",
    "options": [],
    "accept": [
      "À tarde"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Por que a administração publicou uma nova mensagem?",
    "answer": "Para explicar o atraso",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Para explicar o atraso"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "O que se pode inferir sobre os moradores que guardaram água?",
    "answer": "Que se prepararam para a interrupção do abastecimento",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Que se prepararam para a interrupção do abastecimento"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é a finalidade principal do texto?",
    "answer": "Informar sobre a manutenção e o que ocorreu",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Informar sobre a manutenção e o que ocorreu"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Identifique uma relação de contraste no texto.",
    "answer": "\"mas durou duas horas a mais...\"",
    "kind": "short-text",
    "options": [],
    "accept": [
      "\"mas durou duas horas a mais...\""
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "A palavra \"ele\", se usada para substituir \"o serviço\", seria um recurso de:",
    "answer": "b",
    "kind": "choice",
    "options": [
      "repetição",
      "coesão",
      "pontuação"
    ],
    "accept": [
      "b"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Sugira um título adequado.",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal coerente"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é a causa apresentada na frase?",
    "answer": "A necessidade de confirmar os dados antes da reunião",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A necessidade de confirmar os dados antes da reunião"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é a ação principal de Luciana?",
    "answer": "Entregou o relatório ao gerente",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Entregou o relatório ao gerente"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Substitua \"Luciana\" por um pronome sem perder o sentido.",
    "answer": "Ela entregou o relatório...",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Ela entregou o relatório..."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Reescreva no plural: \"O gerente confirmou o dado.\"",
    "answer": "Os gerentes confirmaram os dados.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Os gerentes confirmaram os dados."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Reescreva a frase no passado: \"A equipe confere os documentos.\"",
    "answer": "A equipe conferiu os documentos.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A equipe conferiu os documentos."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Reescreva a frase no futuro: \"A equipe confere os documentos.\"",
    "answer": "A equipe conferirá os documentos. / A equipe vai conferir os documentos.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "A equipe conferirá os documentos. / A equipe vai conferir os documentos."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Revise a frase: \"os funcionario chegou cedo e organizou os documento.\"",
    "answer": "Os funcionários chegaram cedo e organizaram os documentos.",
    "kind": "short-text",
    "options": [],
    "accept": [
      "Os funcionários chegaram cedo e organizaram os documentos."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "porcentagem",
    "level": "N5",
    "topic": "MATEMÁTICA",
    "prompt": "Produza um pequeno texto de 5 a 7 frases sobre uma situação realista do cotidiano. O texto deve ter:",
    "answer": "",
    "kind": "text",
    "options": [],
    "accept": [
      "Resposta pessoal. Critérios: 5 a 7 frases; sequência clara; conectivo; concordância; pontuação; coerência."
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 1, 2, 3, __, __, 6.",
    "answer": "4, 5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "4, 5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 4, 5, __, 7.",
    "answer": "6",
    "kind": "short-text",
    "options": [],
    "accept": [
      "6"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é maior: 3 ou 7?",
    "answer": "7",
    "kind": "short-text",
    "options": [],
    "accept": [
      "7"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é menor: 2 ou 9?",
    "answer": "2",
    "kind": "short-text",
    "options": [],
    "accept": [
      "2"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "2 + 1 = __",
    "answer": "3",
    "kind": "short-text",
    "options": [],
    "accept": [
      "3"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "3 + 2 = __",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "5 - 2 = __",
    "answer": "3",
    "kind": "short-text",
    "options": [],
    "accept": [
      "3"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "7 - 3 = __",
    "answer": "4",
    "kind": "short-text",
    "options": [],
    "accept": [
      "4"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 2 + __ = 5.",
    "answer": "3",
    "kind": "short-text",
    "options": [],
    "accept": [
      "3"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 1 + __ = 4.",
    "answer": "3",
    "kind": "short-text",
    "options": [],
    "accept": [
      "3"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Qual número vem depois de 8?",
    "answer": "9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Qual número vem antes de 6?",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Coloque em ordem crescente: 5, 2, 4.",
    "answer": "2, 4, 5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "2, 4, 5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Coloque em ordem decrescente: 3, 8, 6.",
    "answer": "8, 6, 3",
    "kind": "short-text",
    "options": [],
    "accept": [
      "8, 6, 3"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Um setor recebeu 3 caixas pela manhã e 2 à tarde. Quantas caixas recebeu no total?",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Havia 6 formulários sobre uma mesa. Dois foram usados. Quantos restaram?",
    "answer": "4",
    "kind": "short-text",
    "options": [],
    "accept": [
      "4"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 6, 7, 8, __, 10.",
    "answer": "9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "4 + 4 = __",
    "answer": "8",
    "kind": "short-text",
    "options": [],
    "accept": [
      "8"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "9 - 4 = __",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N1",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: __ + 2 = 7.",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 10, 11, 12, __, __, 15.",
    "answer": "13, 14",
    "kind": "short-text",
    "options": [],
    "accept": [
      "13, 14"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 20, 21, __, 23, __.",
    "answer": "22, 24",
    "kind": "short-text",
    "options": [],
    "accept": [
      "22, 24"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é maior: 17 ou 12?",
    "answer": "17",
    "kind": "short-text",
    "options": [],
    "accept": [
      "17"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Qual é menor: 14 ou 19?",
    "answer": "14",
    "kind": "short-text",
    "options": [],
    "accept": [
      "14"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "8 + 6 = __",
    "answer": "14",
    "kind": "short-text",
    "options": [],
    "accept": [
      "14"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "9 + 7 = __",
    "answer": "16",
    "kind": "short-text",
    "options": [],
    "accept": [
      "16"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "15 - 6 = __",
    "answer": "9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "18 - 9 = __",
    "answer": "9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 7 + __ = 12.",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: __ + 5 = 13.",
    "answer": "8",
    "kind": "short-text",
    "options": [],
    "accept": [
      "8"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 5, 7, 9, __, __.",
    "answer": "11, 13",
    "kind": "short-text",
    "options": [],
    "accept": [
      "11, 13"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 2, 4, 6, __, __.",
    "answer": "8, 10",
    "kind": "short-text",
    "options": [],
    "accept": [
      "8, 10"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Em uma sala havia 9 pessoas. Chegaram mais 5. Quantas ficaram na sala?",
    "answer": "14",
    "kind": "short-text",
    "options": [],
    "accept": [
      "14"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Um arquivo tinha 16 pastas. Quatro foram retiradas. Quantas ficaram?",
    "answer": "12",
    "kind": "short-text",
    "options": [],
    "accept": [
      "12"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Uma equipe separou 7 documentos pela manhã e 8 à tarde. Quantos documentos separou?",
    "answer": "15",
    "kind": "short-text",
    "options": [],
    "accept": [
      "15"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Havia 20 cadeiras. Seis foram levadas para outra sala. Quantas restaram?",
    "answer": "14",
    "kind": "short-text",
    "options": [],
    "accept": [
      "14"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: __ + 8 = 17.",
    "answer": "9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 14 - __ = 9.",
    "answer": "5",
    "kind": "short-text",
    "options": [],
    "accept": [
      "5"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Coloque em ordem crescente: 18, 11, 15, 13.",
    "answer": "11, 13, 15, 18",
    "kind": "short-text",
    "options": [],
    "accept": [
      "11, 13, 15, 18"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "adicao",
    "level": "N2",
    "topic": "MATEMÁTICA",
    "prompt": "Coloque em ordem decrescente: 9, 16, 12, 20.",
    "answer": "20, 16, 12, 9",
    "kind": "short-text",
    "options": [],
    "accept": [
      "20, 16, 12, 9"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "24 + 13 = __",
    "answer": "37",
    "kind": "short-text",
    "options": [],
    "accept": [
      "37"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "35 + 22 = __",
    "answer": "57",
    "kind": "short-text",
    "options": [],
    "accept": [
      "57"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "48 - 16 = __",
    "answer": "32",
    "kind": "short-text",
    "options": [],
    "accept": [
      "32"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "52 - 27 = __",
    "answer": "25",
    "kind": "short-text",
    "options": [],
    "accept": [
      "25"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 18 + __ = 30.",
    "answer": "12",
    "kind": "short-text",
    "options": [],
    "accept": [
      "12"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: __ + 17 = 40.",
    "answer": "23",
    "kind": "short-text",
    "options": [],
    "accept": [
      "23"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: 45 - __ = 29.",
    "answer": "16",
    "kind": "short-text",
    "options": [],
    "accept": [
      "16"
    ],
    "source": "questoes_jovens_adultos_5_niveis.txt"
  },
  {
    "skill": "multiplicacao",
    "level": "N3",
    "topic": "MATEMÁTICA",
    "prompt": "Complete: __ - 12 = 31.",
    "answer": "43",