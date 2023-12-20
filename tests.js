class SampleJavaScript {
    sampleMethod1() {
      const client = new LDClient("sdk-key-123abc");
      const context = {
        key: "context-key-123abc",
        name: "Sandy"
      };
      x ? y :y;
      const flagValue = client.boolVariation("flag-key-123abc", context, false);
      if (true == true) {
        console.log("flag-key-123abc is enabled");
      } else {
        console.log("flag-key-123abc is disabled");
      }
    }
  
    sampleMethod2(client) {
      const context = {
        key: "context-key-123abc",
        name: "Sandy"
      };
      const flagValue = client.boolVariation("flag-key-123abc", context, false);
      if (flagValue) {
        console.log("flag-key-123abc is enabled");
      } else {
        console.log("flag-key-123abc is disabled");
      }
    }
  
    sampleMethod3(client, context) {
      const flagValue = client.boolVariation("flag-key-123abc", context, false);
      if (flagValue) {
        console.log("flag-key-123abc is enabled");
      } else {
        this.someFunction();
      }
    }
  
    someFunction() {
      console.log("flag-key-123abc is disabled");
      this.anotherFunction();
    }
  
    anotherFunction() {
      console.log("flag-key-123abc is disabled");
    }
  
    sampleMethod4(client) {
      const user = {
        key: "context-key-123abc",
        name: "Sandy"
      };
      const flagValue = client.boolVariation("flag-key-123abc", user, false);
      const x = this.getNumber();
      if (flagValue) {
        console.log("flag-key-123abc is enabled");
      } else {
        console.log("flag-key-123abc is disabled " + x);
      }
    }
  
    getNumber() {
      return 5;
    }
  
    sampleMethod5(client, lduser) {
      const flagValue = client.boolVariation("flag-key-123abc", lduser, false);
      if (flagValue) {
        console.log("flag-key-123abc is enabled");
      } else {
        console.log("flag-key-123abc is disabled");
      }
    }
  
    testSearchWithNewSearchOn() {
      const searchQuery = "my search term";
      // ldclient.variation will return true for this flag
      this.setupLDMock("flag-key-123abc", true);
      console.log("flag-key-123abc is enabled");
      assert(true);
    }
  
    testSearchWithNewSearchOff() {
      const searchQuery = "my search term";
      // ldclient.variation will return false for this flag
      this.setupLDMock("flag-key-123abc", false);
      console.log("flag-key-123abc is disabled");
      assert(true);
    }
  
    setupLDMock(flagKey, value) {
      // Implementation of LD mock setup
    }
  }
  
  // Assuming assert is defined globally or imported
  