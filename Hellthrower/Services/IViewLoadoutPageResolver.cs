using Hellthrower.Models;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower.Services;

public interface IViewLoadoutPageResolver
{
    Page ResolveLoadoutPage(Loadout loadout);
}