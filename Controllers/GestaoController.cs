using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cartao_Ponto.Controllers
{
    [Authorize] // Só quem está logado (cookie válido) consegue acessar essa tela
    public class GestaoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}