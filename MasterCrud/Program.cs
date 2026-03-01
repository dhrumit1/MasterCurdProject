using MasterCrud.Model;
using MasterCrud.Model.DTO;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReact");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ================= PRODUCTS =================

// Get all products
app.MapGet("/api/products", async (AppDbContext db) =>
    await db.Product.ToListAsync());

// Get product by id
app.MapGet("/api/products/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Product.FindAsync(id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

// Add product
app.MapPost("/api/products", async (Product product, AppDbContext db) =>
{
    db.Product.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/api/products/{product.ProductId}", product);
});

// Update product
app.MapPut("/api/products/{id:int}", async (int id, Product input, AppDbContext db) =>
{
    var product = await db.Product.FindAsync(id);
    if (product is null) return Results.NotFound();

    product.ProductName = input.ProductName;
    product.Price = input.Price;

    await db.SaveChangesAsync();
    return Results.Ok(product);
});

// Delete product
app.MapDelete("/api/products/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Product.FindAsync(id);
    if (product is null) return Results.NotFound();

    db.Product.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ================= ORDERS =================

// Get all orders with product
app.MapGet("/api/orders", async (AppDbContext db) =>
{
    var order = await db.Orders
        .Include(o => o.Product)
        .Select(o => new OrdersDto
        {
            OrderId = o.OrderId,
            OrderSeq = o.OrderSeq,
            ProductId = o.ProductId,
            ProductName = o.Product!.ProductName,
            Qty = o.Qty,
            TotalPrice = o.TotalPrice,
            OrderDate = o.OrderDate
        })
        .ToListAsync();

    return order is null ? Results.NotFound() : Results.Ok(order);
});

// Add order
app.MapPost("/api/orders", async (Orders order, AppDbContext db) =>
{
    var product = await db.Product.FindAsync(order.ProductId);
    if (product is null)
        return Results.BadRequest("Invalid ProductId");

    order.TotalPrice = product.Price * order.Qty;

    db.Orders.Add(order);
    await db.SaveChangesAsync();

    return Results.Ok(order);
});

app.Run();
