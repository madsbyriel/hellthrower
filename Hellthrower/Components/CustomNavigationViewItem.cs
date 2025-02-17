using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using Hellthrower.Extensions;
using Hellthrower.Models;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower.Components;

public class CustomNavigationViewItem : NavigationViewItem
{
    public static readonly DependencyProperty ItemTemplateProperty = DependencyProperty.Register(
        nameof(ItemTemplate), typeof(DataTemplate), typeof(CustomNavigationViewItem), new PropertyMetadata(default(DataTemplate), Update));

    public static readonly DependencyProperty ItemsSourceProperty = DependencyProperty.Register(
        nameof(ItemsSource), typeof(ObservableCollection<Loadout>), typeof(CustomNavigationViewItem), new PropertyMetadata(default(ObservableCollection<object>), Update));

    public ObservableCollection<Loadout> ItemsSource
    {
        get { return (ObservableCollection<Loadout>)GetValue(ItemsSourceProperty); }
        set { SetValue(ItemsSourceProperty, value); }
    }

    private static void Update(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        var self = (CustomNavigationViewItem)d;
        self.Update();
    }

    public DataTemplate ItemTemplate
    {
        get { return (DataTemplate)GetValue(ItemTemplateProperty); }
        set { SetValue(ItemTemplateProperty, value); }
    }

    public void Update()
    {
        if (ItemTemplate is null || ItemsSource is null) return;
        ItemsSource.CollectionChanged += (_, _) => UpdateElements();
        UpdateElements();
    }

    public void UpdateElements()
    {
        MenuItems.Clear();
        var tmp = ItemsSource.Map(x =>
        {
            var k = ItemTemplate.LoadContent() as FrameworkElement;
            k.DataContext = x;
            return k;
        });
        
        foreach (var frameworkElement in tmp)
        {
            MenuItems.Add(frameworkElement);
        }
    }
}