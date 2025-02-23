using HellthrowerWPF.Pages;

namespace HellthrowerWPF.Services;

public interface ILoadoutPageResolver
{
    LoadoutPage? ResolveFromTag(object tagObject);
}