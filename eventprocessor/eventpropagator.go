package eventprocessor

import (
	"fmt"
	"sync"
	"time"

	"github.com/go-vgo/robotgo"
	"github.com/madsbyriel/gfac"
	"github.com/madsbyriel/hellthrower/config"
	hook "github.com/robotn/gohook"
)

type listener_vals struct {}

type IEventProcessor interface {

}

func RegisterEventProcessor(c *gfac.Container) {
    c.Register(&listener_vals{}, (*IEventProcessor)(nil))
}

func (l *listener_vals) Init(config config.IConfig) *listener_vals {
    mutex := &sync.Mutex{}

    for _, trigger := range config.GetTriggers() {
        if trigger.Output == "" {
            fmt.Printf("The trigger (%v) has no output!\n", trigger.Trigger)
            continue;
        }

        if len(trigger.Trigger) == 0 {
            fmt.Println("A trigger has no activation keys!")
            continue
        }

        foundFlaw := false
        for _, t := range trigger.Trigger {
            if t == "" {
                fmt.Println("A trigger has an empty activation key! A key must be named.")
                foundFlaw = true
            }
        }
        if foundFlaw {
            continue
        }

        hook.Register(hook.KeyDown, trigger.Trigger, func(e hook.Event) {
            mutex.Lock()
            defer mutex.Unlock()

            robotgo.KeyDown("ctrl")
            time.Sleep(time.Millisecond * time.Duration(config.GetDelayPerCharacter()))
            for _, char := range trigger.Output {
                time.Sleep(time.Millisecond * time.Duration(config.GetDelayPerCharacter()))
                robotgo.TypeStr(string(char))
            }
            robotgo.KeyUp("ctrl")
        })
    }

    s := hook.Start()
    <-hook.Process(s)

    return &listener_vals{}
}
