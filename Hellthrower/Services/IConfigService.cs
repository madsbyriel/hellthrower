using Hellthrower.Models;

namespace Hellthrower.Services;

public interface IConfigService
{
    ConfigModel GetConfigModel();
    void Save();
}