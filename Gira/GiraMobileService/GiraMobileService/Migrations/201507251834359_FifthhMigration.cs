namespace GiraMobileService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FifthhMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GiraMobileService.GiraRequestAcknowledges", "Id", "GiraMobileService.GiraRequests");
            DropForeignKey("GiraMobileService.GiraRequestAcknowledges", "Id", "GiraMobileService.GiraUsers");
            DropIndex("GiraMobileService.GiraRequestAcknowledges", new[] { "Id" });
            AddColumn("GiraMobileService.GiraRequestAcknowledges", "GiraRequestRefId", c => c.String(maxLength: 128));
            AddColumn("GiraMobileService.GiraRequestAcknowledges", "GiraUserRefId", c => c.String(maxLength: 128));
            CreateIndex("GiraMobileService.GiraRequestAcknowledges", "GiraRequestRefId");
            CreateIndex("GiraMobileService.GiraRequestAcknowledges", "GiraUserRefId");
            AddForeignKey("GiraMobileService.GiraRequestAcknowledges", "GiraRequestRefId", "GiraMobileService.GiraRequests", "Id");
            AddForeignKey("GiraMobileService.GiraRequestAcknowledges", "GiraUserRefId", "GiraMobileService.GiraUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("GiraMobileService.GiraRequestAcknowledges", "GiraUserRefId", "GiraMobileService.GiraUsers");
            DropForeignKey("GiraMobileService.GiraRequestAcknowledges", "GiraRequestRefId", "GiraMobileService.GiraRequests");
            DropIndex("GiraMobileService.GiraRequestAcknowledges", new[] { "GiraUserRefId" });
            DropIndex("GiraMobileService.GiraRequestAcknowledges", new[] { "GiraRequestRefId" });
            DropColumn("GiraMobileService.GiraRequestAcknowledges", "GiraUserRefId");
            DropColumn("GiraMobileService.GiraRequestAcknowledges", "GiraRequestRefId");
            CreateIndex("GiraMobileService.GiraRequestAcknowledges", "Id");
            AddForeignKey("GiraMobileService.GiraRequestAcknowledges", "Id", "GiraMobileService.GiraUsers", "Id");
            AddForeignKey("GiraMobileService.GiraRequestAcknowledges", "Id", "GiraMobileService.GiraRequests", "Id");
        }
    }
}
