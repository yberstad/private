namespace GiraMobileService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ThirdMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GiraMobileService.GiraRequests", "Id", "GiraMobileService.GiraTypes");
            DropIndex("GiraMobileService.GiraRequests", new[] { "Id" });
            AddColumn("GiraMobileService.GiraRequests", "GiraTypeRefId", c => c.String(maxLength: 128));
            CreateIndex("GiraMobileService.GiraRequests", "GiraTypeRefId");
            AddForeignKey("GiraMobileService.GiraRequests", "GiraTypeRefId", "GiraMobileService.GiraTypes", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("GiraMobileService.GiraRequests", "GiraTypeRefId", "GiraMobileService.GiraTypes");
            DropIndex("GiraMobileService.GiraRequests", new[] { "GiraTypeRefId" });
            DropColumn("GiraMobileService.GiraRequests", "GiraTypeRefId");
            CreateIndex("GiraMobileService.GiraRequests", "Id");
            AddForeignKey("GiraMobileService.GiraRequests", "Id", "GiraMobileService.GiraTypes", "Id");
        }
    }
}
