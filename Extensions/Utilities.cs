using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Windows.Input;
using HellthrowerWPF.Models;

namespace Hellthrower.Extensions;

public class Utilities
{
    public static string KeyToReadableString(int obj)
    {
        if (obj == 0) return "None";
        
        var keyName = KeyInterop.KeyFromVirtualKey(obj).ToString();
        if (string.IsNullOrEmpty(keyName) || keyName == "None")
        {
            keyName = GetMouseButtonString(obj);
        }

        return keyName;
        
    }

    public static string GetMouseButtonString(int buttonCode)
    {
        return buttonCode switch
        {
            1 => "Left Button",    // VK_LBUTTON (0x01)
            2 => "Right Button",   // VK_RBUTTON (0x02)
            4 => "Middle Button",  // VK_MBUTTON (0x04)
            5 => "X Button 1",     // VK_XBUTTON1 (0x05)
            6 => "X Button 2",     // VK_XBUTTON2 (0x06)
            _ => $"Unknown Mouse Button ({buttonCode})"
        };
    }

    [DllImport("user32.dll")]
    static extern bool GetKeyboardState(byte[] lpKeyState);

    [DllImport("user32.dll")]
    static extern uint MapVirtualKey(uint uCode, uint uMapType);

    [DllImport("user32.dll")]
    static extern IntPtr GetKeyboardLayout(uint idThread);

    [DllImport("user32.dll")]
    static extern int ToUnicodeEx(uint wVirtKey, uint wScanCode, byte[] lpKeyState, [Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pwszBuff, int cchBuff, uint wFlags, IntPtr dwhkl);
    
    public static string StratagemToSequence(EStratagem stratagem)
    {
        switch (stratagem)
        {
            case EStratagem.Null:
                return "";
            case EStratagem.MachineGun:
                return "saswd";
            case EStratagem.AntiMaterielRifle:
                return "sadws";
            case EStratagem.Stalwart:
                return "saswwa";
            case EStratagem.ExpendableAntiTank:
                return "ssawd";
            case EStratagem.RecoillessRifle:
                return "sadda";
            case EStratagem.Flamethrower:
                return "sawsw";
            case EStratagem.Autocannon:
                return "saswwd";
            case EStratagem.HeavyMachineGun:
                return "sawss";
            case EStratagem.AirburstRocketLauncher:
                return "swwad";
            case EStratagem.Commando:
                return "sawsd";
            case EStratagem.Railgun:
                return "sdswad";
            case EStratagem.Spear:
                return "sswss";
            case EStratagem.WASPLauncher:
                return "sswsd";
            case EStratagem.OrbitalGatlingBarrage:
                return "dsaww";
            case EStratagem.OrbitalAirburstStrike:
                return "ddd";
            case EStratagem.Orbital120mmHEBarrage:
                return "ddsads";
            case EStratagem.Orbital380mmHEBarrage:
                return "dswwass";
            case EStratagem.OrbitalWalkingBarrage:
                return "dsdsds";
            case EStratagem.OrbitalLaser:
                return "dswds";
            case EStratagem.OrbitalNapalmBarrage:
                return "ddsadw";
            case EStratagem.OrbitalRailcannonStrike:
                return "dwssd";
            case EStratagem.EagleStrafingRun:
                return "wdd";
            case EStratagem.EagleAirstrike:
                return "wdsd";
            case EStratagem.EagleClusterBomb:
                return "wdssd";
            case EStratagem.EagleNapalmAirstrike:
                return "wdsw";
            case EStratagem.JumpPack:
                return "swwsw";
            case EStratagem.EagleSmokeStrike:
                return "wdws";
            case EStratagem.Eagle110mmRocketPods:
                return "wdwa";
            case EStratagem.Eagle500kgBomb:
                return "wdsss";
            case EStratagem.FastReconVehicle:
                return "asdsdsw";
            case EStratagem.OrbitalPrecisionStrike:
                return "ddw";
            case EStratagem.OrbitalGasStrike:
                return "ddsd";
            case EStratagem.OrbitalEMSStrike:
                return "ddas";
            case EStratagem.OrbitalSmokeStrike:
                return "ddsw";
            case EStratagem.HMGEmplacement:
                return "swadda";
            case EStratagem.ShieldGeneratorRelay:
                return "ssadad";
            case EStratagem.TeslaTower:
                return "swdwad";
            case EStratagem.AntiPersonnelMinefield:
                return "sawd";
            case EStratagem.SupplyPack:
                return "saswws";
            case EStratagem.GrenadeLauncher:
                return "sawas";
            case EStratagem.LaserCannon:
                return "saswa";
            case EStratagem.IncendiaryMines:
                return "saas";
            case EStratagem.GuardDogLaserRover:
                return "swawdd";
            case EStratagem.BallisticShieldBackpack:
                return "sasswa";
            case EStratagem.ArcThrower:
                return "sdswaa";
            case EStratagem.AntiTankMines:
                return "saww";
            case EStratagem.QuasarCannon:
                return "sswad";
            case EStratagem.ShieldGeneratorPack:
                return "swadad";
            case EStratagem.GasMines:
                return "saad";
            case EStratagem.MachineGunSentry:
                return "swddw";
            case EStratagem.GatlingSentry:
                return "swda";
            case EStratagem.MortarSentry:
                return "swdds";
            case EStratagem.GuardDog:
                return "swawds";
            case EStratagem.AutocannonSentry:
                return "swdwaw";
            case EStratagem.RocketSentry:
                return "swdda";
            case EStratagem.EMSMortarSentry:
                return "swdsd";
            case EStratagem.PatriotExosuit:
                return "asdwass";
            case EStratagem.EmancipatorExosuit:
                return "asdwasw";
            case EStratagem.Sterilizer:
                return "sawsa";
            case EStratagem.GuardDogBreath:
                return "swawdw";
            case EStratagem.DirectionalShield:
                return "swadww";
            case EStratagem.AntiTankEmplacement:
                return "swaddd";
            case EStratagem.FlameSentry:
                return "swdsww";
            case EStratagem.PortableHellbomb:
                return "sdwww";
            case EStratagem.SoSBeacon:
                return "wsdw";
            case EStratagem.Resupply:
                return "sswd";
            case EStratagem.EagleRearm:
                return "wwawd";
            case EStratagem.SSSDDelivery:
                return "sssww";
            case EStratagem.ProspectingDrill:
                return "ssadss";
            case EStratagem.SuperEarthFlag:
                return "swsw";
            case EStratagem.Hellbomb:
                return "swaswdsw";
            case EStratagem.UploadData:
                return "adwww";
            case EStratagem.SeismicProbe:
                return "wwadss";
            case EStratagem.OrbitalIlluminationFlare:
                return "ddaa";
            case EStratagem.SEAFArtillery:
                return "dwws";
            case EStratagem.DarkFluidVessel:
                return "wadsww";
            case EStratagem.TectonicDrill:
                return "wswsws";
            case EStratagem.HiveBreakerDrill:
                return "awsdss";
        }

        return "";
    }
}