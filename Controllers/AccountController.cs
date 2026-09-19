using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Cartao_Ponto.Models;

namespace Cartao_Ponto.Controllers
{
    public class AccountController : Controller
    {
        // Credenciais fixas apenas para teste (não usar em produção)
        private const string UsuarioValido = "admin";
        private const string SenhaValida = "123456";

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (model.Usuario == UsuarioValido && model.Senha == SenhaValida)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, model.Usuario)
                };
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

               return RedirectToAction("Index", "Gestao");
            }

            ModelState.AddModelError(string.Empty, "Usuário ou senha inválidos.");
            return View(model);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
    }
}