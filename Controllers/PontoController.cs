using Cartao_Ponto.Data;
using Cartao_Ponto.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cartao_Ponto.Controllers
{
    public class PontoController : Controller
    {
        private readonly PontoDbContext _context;

        public PontoController(PontoDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

[HttpPost]
public IActionResult RegistrarEntrada()
{
    var registro = new RegistroPonto
    {
        UsuarioId = 1,
        Data = DateTime.Today,
        Entrada = DateTime.Now
    };

    _context.RegistrosPonto.Add(registro);
    _context.SaveChanges();

    return RedirectToAction("Index");
}
    }
}