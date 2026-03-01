namespace MasterCrud.Model
{
    public class Orders
    {
        public string? OrderId { get; set; }
        public int OrderSeq { get; set; }
        public string? ProductId { get; set; }
        public int Qty { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }

        public Product? Product { get; set; }
    }
}
