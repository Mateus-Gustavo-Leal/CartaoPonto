using Microsoft.AspNetCore.Authentication.Cookies; // ADICIONADO: necessário para login por cookie
using Microsoft.EntityFrameworkCore;// Para o Banco de sados SQLite
using Cartao_Ponto.Data;// Para o banco
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<PontoDbContext>(options =>
    options.UseSqlite("Data Source=ponto.db"));

// ADICIONADO: registra o serviço de autenticação por cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/Login";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseRouting();

app.UseAuthentication(); //tem que vir ANTES do UseAuthorization
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}") // ALTERADO: Home/Index -> Account/Login
    .WithStaticAssets();


app.Run();