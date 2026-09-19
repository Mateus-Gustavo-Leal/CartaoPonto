# CartaoPonto

Cartão Ponto

Projeto de um sistema de cartão ponto desenvolvido para praticar C# e desenvolvimento web.

A ideia é criar um sistema onde o usuário consiga fazer login e registrar seus horários de entrada, intervalo e saída.

Tecnologias
C#
ASP.NET Core MVC
Entity Framework Core
SQLite
HTML
CSS
JavaScript
Razor

O que já foi feito
Sistema de login
Autenticação por cookies
Banco de dados SQLite
Cadastro de registros de ponto
Registro do horário de entrada
Consulta do último registro salvo
Banco de dados

O banco utilizado no projeto é o SQLite.

A tabela RegistrosPonto possui atualmente:

Id
UsuarioId
Data
Entrada
InicioIntervalo
FimIntervalo
Saida

Os dados são salvos utilizando o Entity Framework Core.



Ao clicar em Registrar Entrada, o sistema pega a data e hora atual e salva no banco.

Depois disso, o sistema consegue consultar o último registro e mostrar o horário de entrada na tela.

Estrutura
Cartao_Ponto/
Controllers/
Data/
Models/
Views/
wwwroot/
Program.cs
Cartao_Ponto.csproj
Como executar

Clone o projeto e entre na pasta:

git clone URL_DO_REPOSITORIO
cd Cartao_Ponto

Depois restaure os pacotes:

dotnet restore

E execute:

dotnet run

A aplicação será executada em um endereço local mostrado no terminal.

Próximos passos

Ainda quero adicionar algumas funcionalidades ao projeto, como:

Registrar início e fim do intervalo
Registrar saída
Mostrar histórico de pontos
Relacionar o ponto ao usuário que está logado
Melhorar a interface
Adicionar verificação de localização para permitir o registro somente dentro de um determinado raio
Sobre o projeto

Esse é um projeto que estou desenvolvendo durante meus estudos para praticar C#, ASP.NET Core, banco de dados e desenvolvimento web.

Mateus Gustavo Leal
