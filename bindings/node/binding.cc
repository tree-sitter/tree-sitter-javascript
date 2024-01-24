#include "tree_sitter/parser.h"
#include <node.h>
#include "nan.h"

using namespace v8;

extern "C" TSLanguage * tree_sitter_javascript();
extern "C" TSLanguage * tree_sitter_jsx();

namespace {

NAN_METHOD(New) {}

void Init(Local<Object> exports, Local<Object> module) {
  Local<FunctionTemplate> js_tpl = Nan::New<FunctionTemplate>(New);
  js_tpl->SetClassName(Nan::New("Language").ToLocalChecked());
  js_tpl->InstanceTemplate()->SetInternalFieldCount(1);
  Local<Function> js_constructor = Nan::GetFunction(js_tpl).ToLocalChecked();
  Local<Object> js_instance = js_constructor->NewInstance(Nan::GetCurrentContext()).ToLocalChecked();
  Nan::SetInternalFieldPointer(js_instance, 0, tree_sitter_javascript());
  Nan::Set(js_instance, Nan::New("name").ToLocalChecked(), Nan::New("javascript").ToLocalChecked());

  Local<FunctionTemplate> jsx_tpl = Nan::New<FunctionTemplate>(New);
  jsx_tpl->SetClassName(Nan::New("Language").ToLocalChecked());
  jsx_tpl->InstanceTemplate()->SetInternalFieldCount(1);
  Local<Function> jsx_constructor = Nan::GetFunction(jsx_tpl).ToLocalChecked();
  Local<Object> jsx_instance = jsx_constructor->NewInstance(Nan::GetCurrentContext()).ToLocalChecked();
  Nan::SetInternalFieldPointer(jsx_instance, 0, tree_sitter_jsx());
  Nan::Set(jsx_instance, Nan::New("name").ToLocalChecked(), Nan::New("jsx").ToLocalChecked());

  Nan::Set(exports, Nan::New("javascript").ToLocalChecked(), js_instance);
  Nan::Set(exports, Nan::New("jsx").ToLocalChecked(), jsx_instance);
}

NODE_MODULE(tree_sitter_javascript_binding, Init)

}  // namespace
