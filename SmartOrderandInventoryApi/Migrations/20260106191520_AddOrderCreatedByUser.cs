using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartOrderandInventoryApi.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderCreatedByUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Orders");
        }
    }
}
