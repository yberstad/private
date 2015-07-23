using System;
using System.Threading.Tasks;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;
using GiraMobileService.DataModel;
using Microsoft.WindowsAzure.MobileServices;

// To add offline sync support, add the NuGet package Microsoft.WindowsAzure.MobileServices.SQLiteStore
// to your project. Then, uncomment the lines marked // offline sync
// For more information, see: http://aka.ms/addofflinesync
//using Microsoft.WindowsAzure.MobileServices.SQLiteStore;  // offline sync
//using Microsoft.WindowsAzure.MobileServices.Sync;         // offline sync

namespace GiraMobileService
{
    sealed partial class MainPage
    {
        private MobileServiceCollection<GiraRequest, GiraRequest> _items;
        private IMobileServiceTable<GiraRequest> giraRequestTable = App.MobileService.GetTable<GiraRequest>();
        //private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>(); // offline sync

        // Define a member variable for storing the signed-in user. 
        private MobileServiceUser _user;

        // Define a method that performs the authentication process
        // using a Facebook sign-in. 
        private async Task AuthenticateAsync()
        {
            while (_user == null)
            {
                string message;
                try
                {
                    // Change 'MobileService' to the name of your MobileServiceClient instance.
                    // Sign-in using Facebook authentication.
                    _user = await App.MobileService
                        .LoginAsync(MobileServiceAuthenticationProvider.Facebook, false);
                    message =
                        string.Format("You are now signed in - {0}", _user.UserId);
                }
                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }

                var dialog = new MessageDialog(message);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
        }

        public MainPage()
        {
            InitializeComponent();
        }

        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            // Login the user and then load data from the mobile service.
            await AuthenticateAsync();

            // Hide the login button and load items from the mobile service.
            ButtonLogin.Visibility = Visibility.Collapsed;
            await RefreshTodoItems();
        }

        private async Task InsertTodoItem(GiraRequest giraRequest)
        {
            // This code inserts a new TodoItem into the database. When the operation completes
            // and Mobile Services has assigned an Id, the item is added to the CollectionView
            await giraRequestTable.InsertAsync(giraRequest);
            _items.Add(giraRequest);

            //await SyncAsync(); // offline sync
        }

        private async Task RefreshTodoItems()
        {
            MobileServiceInvalidOperationException exception = null;
            try
            {
                // This code refreshes the entries in the list view by querying the TodoItems table.
                // The query excludes completed TodoItems
                _items = await giraRequestTable
                    .Where(todoItem => todoItem.Enabled == false)
                    .ToCollectionAsync();
            }
            catch (MobileServiceInvalidOperationException e)
            {
                exception = e;
            }

            if (exception != null)
            {
                await new MessageDialog(exception.Message, "Error loading items").ShowAsync();
            }
            else
            {
                ListItems.ItemsSource = _items;
                ButtonSave.IsEnabled = true;
            }
        }

        private async Task UpdateCheckedTodoItem(GiraRequest item)
        {
            // This code takes a freshly completed TodoItem and updates the database. When the MobileService 
            // responds, the item is removed from the list 
            await giraRequestTable.UpdateAsync(item);
            _items.Remove(item);
            ListItems.Focus(FocusState.Unfocused);

            //await SyncAsync(); // offline sync
        }

        private async void ButtonRefresh_Click(object sender, RoutedEventArgs e)
        {
            ButtonRefresh.IsEnabled = false;

            //await SyncAsync(); // offline sync
            await RefreshTodoItems();

            ButtonRefresh.IsEnabled = true;
        }

        private async void ButtonSave_Click(object sender, RoutedEventArgs e)
        {
            var todoItem = new GiraRequest { Location = TextInput.Text };
            await InsertTodoItem(todoItem);
        }

        private async void CheckBoxComplete_Checked(object sender, RoutedEventArgs e)
        {
            CheckBox cb = (CheckBox)sender;
            GiraRequest item = cb.DataContext as GiraRequest;
            await UpdateCheckedTodoItem(item);
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            //await InitLocalStoreAsync(); // offline sync
            //await RefreshTodoItems();
        }

        #region Offline sync

        //private async Task InitLocalStoreAsync()
        //{
        //    if (!App.MobileService.SyncContext.IsInitialized)
        //    {
        //        var store = new MobileServiceSQLiteStore("localstore.db");
        //        store.DefineTable<TodoItem>();
        //        await App.MobileService.SyncContext.InitializeAsync(store);
        //    }
        //
        //    await SyncAsync();
        //}

        //private async Task SyncAsync()
        //{
        //    await App.MobileService.SyncContext.PushAsync();
        //    await todoTable.PullAsync("todoItems", todoTable.CreateQuery());
        //}

        #endregion 
    }
}
