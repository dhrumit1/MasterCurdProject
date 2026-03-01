namespace MasterCrud.Model
{
    public class Product
    {
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }

        public List<Orders>? Orders { get; set; }
    }
}
