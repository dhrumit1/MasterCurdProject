namespace MasterCrud.Model.DTO
{
    public class OrdersDto
    {
        public int Id { get; set; }      
        public string? OrderId { get; set; }
        public int OrderSeq { get; set; }
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public int Qty { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }

    }
}
