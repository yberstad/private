namespace GiraMobileService.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class SecondMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("GiraMobileService.GiraRequests", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GiraMobileService.GiraRequests", "Description");
        }
    }
}
