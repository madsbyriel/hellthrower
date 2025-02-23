using HellthrowerWPF.Models;

namespace HellthrowerWPF.Services;

public interface IConfigService
{
    ConfigModel GetConfigModel();
    void Save();
}