using System.ComponentModel.DataAnnotations;

namespace Cartao_Ponto.Models
{
    // Representa os dados enviados pelo formulário de login
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Informe o usuário")]
        public string Usuario { get; set; }

        [Required(ErrorMessage = "Informe a senha")]
        [DataType(DataType.Password)] // Faz o campo aparecer como "senha" (bolinhas)
        public string Senha { get; set; }
    }
}