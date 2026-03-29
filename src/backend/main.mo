import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";

actor {
  type Segment = {
    index : Nat;
    text : Text;
    brollKeywords : [Text];
  };

  type Project = {
    id : Text;
    title : Text;
    script : Text;
    createdAt : Int;
    segments : [Segment];
  };

  type ProjectSummary = {
    id : Text;
    title : Text;
    createdAt : Int;
  };

  type ApiKeys = {
    elevenLabsKey : ?Text;
    preferredVoiceId : ?Text;
  };

  type TtsRequest = {
    script : Text;
    voiceId : Text;
  };

  type TtsResponse = {
    audio : Text;
    error : ?Text;
  };

  module ProjectSummary {
    public func compare(p1 : ProjectSummary, p2 : ProjectSummary) : Order.Order {
      switch (Text.compare(p1.title, p2.title)) {
        case (#equal) { Text.compare(p1.id, p2.id) };
        case (order) { order };
      };
    };
  };

  var apiKeys : ApiKeys = {
    elevenLabsKey = null;
    preferredVoiceId = null;
  };

  let projects = Map.empty<Text, Project>();

  public shared ({ caller }) func saveApiKeys(elevenLabsKey : ?Text, preferredVoiceId : ?Text) : async () {
    apiKeys := {
      elevenLabsKey;
      preferredVoiceId;
    };
  };

  public query ({ caller }) func getApiKeys() : async ApiKeys {
    apiKeys;
  };

  public shared ({ caller }) func saveProject(id : Text, title : Text, script : Text, segments : [Segment]) : async () {
    let project : Project = {
      id;
      title;
      script;
      createdAt = Time.now();
      segments;
    };
    projects.add(id, project);
  };

  public query ({ caller }) func getProject(id : Text) : async Project {
    switch (projects.get(id)) {
      case (?project) { project };
      case (null) { Runtime.trap("Project not found") };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not projects.containsKey(id)) {
      Runtime.trap("Project not found. Duplicate deletion?");
    };
    projects.remove(id);
  };

  public query ({ caller }) func listProjects() : async [ProjectSummary] {
    let iter = projects.values().map(
      func(p) {
        {
          id = p.id;
          title = p.title;
          createdAt = p.createdAt;
        };
      }
    );
    iter.toArray().sort();
  };

  public query ({ caller }) func transform(input: OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func generateTts(request : TtsRequest) : async TtsResponse {
    switch (apiKeys.elevenLabsKey) {
      case (null) { { audio = ""; error = ?("Missing ElevenLabs API key") } };
      case (?apiKey) {
        let url = "https://api.elevenlabs.io/v1/text-to-speech/" # request.voiceId;
        let headers : [OutCall.Header] = [ { name = "xi-api-key"; value = apiKey } ];
        let payload = "{ \"text\": \"" # request.script # "\" }";
        let response = await OutCall.httpPostRequest(url, headers, payload, transform);

        {
          audio = response;
          error = null;
        };
      };
    };
  };
};
