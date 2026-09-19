public class RegistroPonto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateTime Data { get; set; }
    public DateTime? Entrada { get; set; }
    public DateTime? InicioIntervalo { get; set; }
    public DateTime? FimIntervalo { get; set; }
    public DateTime? Saida { get; set; }
}