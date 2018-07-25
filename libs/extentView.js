
var extentView = {
    config: {
        default_alpha_color: "rgba(121,85,72,0.1)",
        sub_color: {
            g500: "#FFC107",
            g50: "#FFF8E1",
            g100: "#FFECB3",
            g200: "#FFE082",
            g300: "#FFD54F",
            g400: "#FFCA28",
            g500: "#FFC107",
            g600: "#FFB300",
            g700: "#FFA000",
            g800: "#FF8F00",
            g900: "#FF6F00",
            gA100: "#FFE57F",
            gA200: "#FFD740",
            gA400: "#FFC400",
            gA700: "#FFAB00"
        },
        main_color: {
            g500: "#9E9E9E",
            g50: "#FAFAFA",
            g100: "#F5F5F5",
            g200: "#EEEEEE",
            g300: "#E0E0E0",
            g400: "#BDBDBD",
            g500: "#9E9E9E",
            g600: "#757575",
            g700: "#616161",
            g800: "#424242",
            g900: "#212121"
        },
        text_color: {
        }
    },

    labelHeader: function (text) {
        var self = dh.IO.textView(text).setTextSize(dhSize.textView.textSize).bold().TextColor("#FFF").textAlign("left");
        self.PaddingLeft(5).PaddingRight(5).PaddingTop(10).PaddingBottom(10).background(extentView.config.main_color.g500);
        return self;
    },
    popup: function () {
        var self = dh.IO.popup().radius(5);


        return self;
    },
    textView: function (text) {
        var self = dh.IO.textView(text)
            .setTextSize(dhSize.textView.textSize)
            .TextColor(extentView.config.text_color.g500).bold();

        self.ellipsis = function () {
            self.control.style.textOverflow = "ellipsis";
            self.control.style.whiteSpace = "nowrap";

        }
        return self;
    },
    flagLabel: function (text, background) {
        var label = extentView.textView(text).PaddingTop(2).PaddingBottom(2).PaddingLeft(4).PaddingRight(4).setTextColor(ggColors.White).background(
            background || ggColors.Grey.g700);
        label.setTextSize(dhSize.textView.textSize_smaller);
        return label;
    },
    actionButton: function (text, icon, color) {
        var self = extentView.button(text).PaddingLeft(20).PaddingRight(20).PaddingTop(8).PaddingBottom(8)
            .TextColor(ggColors.White).background(color || ggColors.Grey.g400);
        self.setIcon(icon).setIconColor(ggColors.White);
        self.getIcon().setRight(5).setTextSize(dhSize.icon.textSize);
        return self;
    },
    editText: function () {
        var self = dh.IO.editText()
            .width("100%")
            .setTextSize(dhSize.textView.textSize)
            .removeShadow().border(0, ggColors.TRANSPARENT)
            .borderBottom(1, extentView.config.main_color.g400)
            .TextColor(extentView.config.text_color.g700)
            .radius(0)
            .background(color.TRANSPARENT)
            .PaddingTop(6).PaddingBottom(6);
        self.setCursorColor(extentView.config.main_color.g500);

        var count = 0;
        var temp_str = "";
        var delay = null;

        var value = "";
        self.setOnkeyDown(function (v, e) {

            if (count == 0) {
                count++;
                temp_str = self.getText();
                delay = dh.Waiter.create(function () {
                    if (count >= 8) {
                        self.setText(temp_str);
                    }
                    count = 0;
                }, 160);

            } else {
                count++;
            }
            console.log("count", count);

        });
        return self;
    },
    textArea: function () {
        return dh.IO.textArea()
            .width("100%")
            .setTextSize(dhSize.textView.textSize)
            .removeShadow().border(0, ggColors.TRANSPARENT)
            .borderBottom(1, extentView.config.text_color.g400)
            .TextColor(extentView.config.text_color.g600)
            .radius(0)
            .background(color.TRANSPARENT)
            .PaddingTop(6).PaddingBottom(6);
    },
    iconButton: function (icon, size) {
        var self = dh.IO.iconButton(icon, size);
        return self;
    },
    button: function (text) {
        return dh.IO.button(text).setTextSize(dhSize.textView.textSize);
    },
    viewInputText: function (label, value) {
        var isLabelRight = false, is_label_floating = false;
        var focusingColor = ggColors.Blue.gA200;
        var f_setText;
        var self = dh.IO.block().float("left");

        var editText = extentView.editText().borderBottom(1, extentView.config.main_color.g100);

        var label = extentView.textView(label)
            .toLeftParent().toTopParent().toBottomParent().textAlign("left").TextColor(extentView.config.text_color.g400).setTag(extentView.config.main_color.g400);
        //     label.opacity(0);
        var border_bottom = dh.IO.textView("").toBottomParent().setHeight(1).background(extentView.config.text_color.g300).toLeftParent().toRightParent();
        var border_bottom_focused = dh.IO.textView("").toBottomParent()
            .setHeight(2).setTransitionAll(".2").ScaleX(0)
            .background(focusingColor).toLeftParent().toRightParent();
        dh.IOUtil.centerInParent(label);
        f_setText = editText.setText;
        self.setLabel = function (text) {
            label.setText(text);
            reload(label);
        }

        self.setValue = function (val) {
            editText.setText(val);
            self.clearError();
        }

        editText.setText = function (text) {
            if(!hasRendered){
                editText.postDelay(function(){
                    editText.setText(text);
                },200)
                return;
            }
            if (text && is_label_floating && text.length > 0 && editText.getText().length == 0) {
                floatingLabel(true);
            } else if (text &&is_label_floating && text.length == 0 && !editText.isFocusing()) {
                floatingLabel(false);
            }
            f_setText(text);
            return editText;
        }

        self.clearError = function () {
            border_bottom_focused.ScaleX(0);
            editText.setError("");
            self.postDelay(function () {
                border_bottom_focused.background(focusingColor);
            }, 200);
        }

        function reload(view) {
            if (isLabelRight) {
                editText.PaddingLeft(5);
                editText.PaddingRight(view.getWidth() + 10);
                label.control.style.left = "auto";
                label.textAlign("right");
                label.toRightParent();
            } else {
                if (editText.getPaddingLeft() <= 5 && editText.control.style.textAlign.toLowerCase() != "center") {
                    editText.PaddingLeft(view.getWidth() + 10);
                }
                label.textAlign("left");
                label.opacity(1);
            }
        }

        self.setLabelAtRight = function () {
            isLabelRight = true;
            if (editText.info.isCreated) {
                label.control.style.left = "auto";
                label.textAlign("right");
                label.toRightParent();
                editText.PaddingLeft(5);
                editText.PaddingRight(label.getWidth() + 10);

            } else {
                editText.PaddingLeft(label.getWidth() + 10);
                label.textAlign("left");
            }
        }
        self.addView(label);
        self.addView(editText);

        editText.setEnable = function (enable) {
            editText.zIndex(enable ? -1 : 2);
            editText.super.setEnable(enable);
            return self;
        }

        self.PaddingBottom = function (padding) {
            editText.PaddingBottom(padding);
            return self;
        }
        self.PaddingTop = function (padding) {
            editText.PaddingTop(padding);
            return self;
        }

        self.setEnable = function (flag) {
            editText.setEnable(flag);
            if (!flag)
                editText.borderBottom(0, color.TRANSPARENT);
            else
                editText.borderBottom(1, extentView.config.text_color.g400)
        }
        self.getText = editText.getText;

        self.getIcon = label.getIcon;
        label.setTransitionAll(".2");
        var label_height = 0, edt_origin_padding_top = -1, edt_origin_padding_bottom = -1;
        editText.events.override.onFocusChanged(function (view, hasFocused) {
            label.TextColor(hasFocused ? dh.Util.colorWithLuminance(label.getTag(), -0.5) : label.getTag());
            if (is_label_floating && view.getText().trim().length == 0) {
                floatingLabel(hasFocused);
            }
        });
        label.setTransformOrigin("left", "top");
        function floatingLabel(hasFocused) {
            if (hasFocused) {
                label.control.style.justifyContent = "inherit";
                label.Scale(0.9).bold();
                editText.PaddingLeftPercent(5);
                label.bold();
            } else {
                label.Scale(1).fontWeight("normal");
                dh.IOUtil.centerInParent(label);
                label.fontWeight("normal");

            }
        }

        function performReLayoutForFloating() {
            label.control.style.justifyContent = "center";
            if (edt_origin_padding_top == -1) {
                edt_origin_padding_top = editText.getPaddingTop();
            }
            editText.PaddingTop(edt_origin_padding_top + label_height * 0.4);
            if (edt_origin_padding_bottom == -1) {
                edt_origin_padding_bottom = editText.getPaddingBottom();
            }
            editText.PaddingBottom(edt_origin_padding_bottom + 5);
            label.setTextSize(parseFloat(editText.getDOM().style.fontSize)).bold();
            editText.PaddingLeftPercent(5);
        }
        var hasRendered = false;
        label.events.override.onMeasured(function (view, width, height) {
            reload(view)
            label_height = height;
            if (is_label_floating) {
                performReLayoutForFloating();
                hasRendered = true;
                // view.postDelay(function () {
                //     // editText.setText(value || "");
                // }, 500);
            }

        });
        self.editText = editText;
        self.label = label;
        self.addView(border_bottom).addView(border_bottom_focused);


        self.events.declare("setFocusing", function (isFocusing) {
            editText.showFocusingCursor(isFocusing);
        });
        self.events.declare("focus", function () {
            editText.focus();
            return self;
        });
        self.events.declare("setOnEnterKey", editText.setOnEnterKey);
        self.events.declare("setOnKeyUp", editText.setOnKeyUp);
        self.events.declare("borderBottom", function (size, color) {
            border_bottom.setHeight(size).background(color);
            return editText;
        });
        self.events.declare("validate", function () {
            if (editText.isEmpty()) {
                border_bottom_focused.background(ggColors.Red.gA400);
                self.setFocusing(true);
                editText.setError(in_app_strings.error_empty_input_text);

                return false;
            }
            editText.setError("");
            return true;
        });
        self.events.declare("setLabelPercentWidth", function (percent) {
            label.minWidth(percent + "%");
            return self;
        });
        self.events.declare("setError", function (error) {
            editText.setError(error);
            if (error.length == 0) {
                self.clearError();
            }
            return self;
        });
        self.events.declare("setLabelColor", function (color) {
            label.TextColor(color);
            label.setTag(color);
            return self;
        });
        self.events.declare("setIcon", function (icon) {
            label.setIcon(icon);
        });
        self.events.declare("removeIcon", function () {
            label.removeIcon();
        });
        self.events.declare("setText", function (text) {
            editText.setText(text);
            return self;
        });
        self.events.declare("setEnableFloating", function (enable) {
            is_label_floating = enable;
            return self;
        });
        self.events.declare("setError", function (error) {
            editText.setError(error);
            return self;
        });
        return self;
    },
    viewTextArea: function (label, value, rows) {
        var isLabelRight = false;

        var self = dh.IO.block().float("left");


        var editText = extentView.textArea().Padding(0).borderBottom(0, "transparent").width("96%").PaddingLeftPercent(2).PaddingRightPercent(2)
            .borderBottom(1, extentView.config.text_color.g400);
        editText.setRow(rows);
        var label = extentView.textView(label).setBottom(5)
            .PaddingTop(6).PaddingBottom(0).textAlign("left").setTag(extentView.config.text_color.g400).width("100%");



        self.addView(label);
        self.addView(editText);


        self.getText = editText.getText;
        label.setOnClick(function (view, e) {
            editText.focus();
        });

        editText.events.override.onFocusChanged(function (view, hasFocused) {
            label.TextColor(hasFocused ? dh.Util.colorWithLuminance(label.getTag(), -0.5) : label.getTag());
        });




        self.editText = editText;
        self.label = label;

        self.events.declare("focus", function () {
            editText.focus();
            return self;
        });
        self.events.declare("setRow", editText.setRow);
        self.events.declare("setOnKeyUp", editText.setOnKeyUp);
        self.events.declare("setOnEnterKey", editText.setOnEnterKey);
        self.events.declare("setLabel", function (text) {
            label.setText(text);
        });
        self.events.declare("setValue", function (val) {
            editText.setText(val);
        });
        self.events.declare("setLabelAtRight", function () {
            isLabelRight = true;
            if (editText.info.isCreated) {
                label.control.style.left = "auto";
                label.textAlign("right");
            } else {
                label.textAlign("left");
            }
        });
        self.events.declare("setLabelAtRight", function (flag) {
            editText.setEnable(flag);
            if (!flag)
                editText.border(0, color.TRANSPARENT);
            else
                editText.borderBottom(1, extentView.config.text_color.g400)

        });
        self.events.declare("setLabelColor", function (color) {
            label.TextColor(color);
            label.setTag(color);
        });
        self.events.declare("setIcon", function (icon) {
            label.setIcon(icon);
        });
        self.events.declare("removeIcon", function () {
            label.removeIcon();
        });
        self.events.declare("getIcon", self.getIcon = label.getIcon);

        return self;
    },
    viewFilterBox: function () {
        var focusingColor = ggColors.Blue.gA200;
        var onSearching = null;
        var pn_search = dh.IO.block("100%", define.Size.WRAP_CONTENT);
        var border_bottom = dh.IO.textView("").toBottomParent().setHeight(1).background(extentView.config.text_color.g500).toLeftParent().toRightParent();
        var border_bottom_focused = dh.IO.textView("").toBottomParent()
            .setHeight(2).setTransitionAll(".2").ScaleX(0)
            .background(focusingColor).toLeftParent().toRightParent();

        var txt_search = extentView.editText().width("100%").minHeight("100%");
        txt_search.setTextSize(dhSize.textView.textSize).background(color.TRANSPARENT);
        txt_search.TextColor(extentView.config.text_color.g700)
            .PaddingTop(8).PaddingBottom(8).border(0, color.TRANSPARENT)
            .radius(0).removeShadow();
        var icon = dh.IO.textView().toLeftParent().setLeft(5).toTopParent().toBottomParent();
        icon.setIcon("search");
        icon.setIconSize(dhSize.icon.bigSize);
        icon.getIcon().TextColor(extentView.config.text_color.g600);

        var lb_count = this.textView("").setTextColor(ggColors.Grey.g400).toTopParent().toBottomParent();

        var btn_clear = this.iconButton("cancel", dhSize.icon.textSize_large).height("100%");
        btn_clear.getIcon().TextColor(extentView.config.text_color.g600);
        btn_clear.toRightParent().setRight(3);
        btn_clear.zIndex(-1).setVisible(false);
        pn_search.addView(icon).addView(txt_search).addView(lb_count).addView(btn_clear);
        lb_count.toLeftOf(btn_clear);
        icon.events.override.onCreated(function (view) {
            txt_search.PaddingLeft(view.control.offsetWidth + 10);
        });
        pn_search.borderBottom = function (size, color) {
            border_bottom.setHeight(size).background(color);
            return pn_search;
        }
        //txt_search.setOnFocusChange(function (view, hasFocused) {
        //    if (hasFocused) {
        //        view.TextColor(extentView.config.text_color.g800);
        //        icon.setIconColor(focusingColor);
        //        border_bottom_focused.ScaleX(1);
        //    } else {
        //        view.TextColor(extentView.config.text_color.g700)
        //        border_bottom_focused.ScaleX(0);
        //        icon.setIconColor(extentView.config.text_color.g600);
        //    }
        //});
        pn_search.PaddingTop = function (padding) {
            txt_search.PaddingTop(padding);
            return pn_search;
        }
        pn_search.PaddingBottom = function (padding) {
            txt_search.PaddingBottom(padding);
            return pn_search;
        }
        pn_search.PaddingLeft = function (padding) {
            txt_search.PaddingLeft(padding);
            return pn_search;
        }
        pn_search.PaddingRight = function (padding) {
            txt_search.PaddingRight(padding);
            return pn_search;
        }

        var onKeyUp, oldLength = 0;
        pn_search.setOnSearching = function (callback) {
            onSearching = callback;
            txt_search.setOnKeyUp(function (view, keycode) {
                if (view.getText().trim().length > 0) {
                    btn_clear.zIndex(4).setVisible(true);
                } else {
                    btn_clear.zIndex(-1).setVisible(false);
                }
                if (view.getText().length != oldLength && keycode != 13) {
                    oldLength = view.getText().length;
                    callback(pn_search, view.getText());
                }
                if (onKeyUp != null) {
                    onKeyUp(view, keycode);
                }
            });
        }
        pn_search.setOnKeyUp = function (listener) {
            onKeyUp = listener;
        }

        pn_search.setText = function (text) {
            if (text.length > 0) {
                btn_clear.zIndex(4).setVisible(true);
            } else {
                btn_clear.zIndex(-1).setVisible(false);
            }
            txt_search.setText(text);
        };
        btn_clear.setOnClick(function (view) {

            txt_search.setText("");
            view.zIndex(-1).setVisible(false);
            if (onSearching != null) {
                onSearching(pn_search, "");
            }
        });

        pn_search.setTextColor = function (color) {
            icon.setIconColor(color);
            btn_clear.setIconColor(color);
            txt_search.setTextColor(color);
        }
        pn_search.focus = txt_search.focus;
        pn_search.addView(border_bottom).addView(border_bottom_focused);
        pn_search.editText = txt_search;
        pn_search.icon = icon;
        return pn_search;
    },
    loading: function () {

    },
    expander: function () {
        return dh.IO.expander();
    },
    sticky: function (view) {
        return dh.IO.sticky(view).radius(4).shadow("rgba(0,0,0,0.2)", 0, 0, 5, false);
    },
    combobox: function () {
        var isShowing = false,
            mDataItems = [],
            mReturnView = null,
            mDataSelecting,
            mDataPosition = -1,
            onSelected,
            mShowFromView,
            box_gravity;
        var self = extentView.button("Chọn").borderBottom(1, extentView.config.text_color.g400).TextColor(ggColors.Red.g400).bold();
        self.setIcon("arrow_drop_down")
            .getIcon().toRightParent().toTopParent().toBottomParent().setRight(2).TextColor(ggColors.Grey.g500);

        self.events.override.onMeasured(function (view) {
            //      var icon_width = view.getIcon().getWidth() * 100 / view.getDOM().offsetWidth ;
            // var max_width = 100 - icon_width;
            // view.PaddingRightPercent(icon_width);
            //view.setMaxWidthPercent(max_width);
        });

        self.setOnClick(function (view) {
            var adapter = new dh.AdapterV2(mDataItems);
            adapter.setView(function (dataItem, position, convertView) {
                var root = dh.IO.block("100%");
                root.addView(mReturnView(dataItem, position, convertView));
                root.setIcon(dataItem == mDataSelecting ? "check" : "").setIconColor(ggColors.Grey.g700).getIcon().toRightParent().toTopParent().toBottomParent().setRight("2%");
                return root;
            });
            var sticky;
            if (isMobile.any()) {
                var sticky = info.BODY.showQuicklyLayout().toLeftParent().toRightParent().setLeft("0%").setRight("0%").setTop("auto").setBottom("0px");
            } else {
                var sticky = dh.IO.sticky(mShowFromView || view);
            }


            if (box_gravity != undefined) {
                sticky.setGravity(box_gravity);
                sticky.setShowAnimation("scaleOpen95");
            }
            sticky.show();
            sticky.radius(self.getRadius());
            sticky.ScrollY();
            if (mShowFromView) {
                sticky.minWidthPixel(mShowFromView.control.offsetWidth);
            } else {
                sticky.minWidthPixel(view.control.offsetWidth);
            }
            var listView = dh.IO.listViewV2().width("100%");
            listView.setAnimation("combobox_open");
            sticky.ScrollY();

            listView.setDhAdapter(adapter);
            adapter.unlockLimitRender(true);
            sticky.addView(listView);
            listView.setOnItemClickListener(function (view, selected, position) {
                mDataSelecting = selected;
                mDataPosition = position;
                if (onSelected != null) {
                    onSelected(self, mDataSelecting, position);
                }
                sticky.dismiss();
            });
            listView.events.override.onMeasured(function (view, width, height) {
                if (sticky.control.offsetHeight > height) {
                    sticky.maxHeightPixel(info.SCREEN_HEIGHT - view.control.offsetTop - 100);
                }else if(info.SCREEN_HEIGHT - view.control.offsetTop < height ){
                    sticky.setBottom(20);
                }
            });
        });

        self.events.declare("setBoxGravity", function (gravity) {
            box_gravity = gravity;
        });

        self.events.declare("setView", function (returnView) {
            mReturnView = returnView;
            return self;
        });
        self.events.declare("setPickerData", function (dataItems) {
            if(dataItems instanceof Array){
                mDataItems = dh.List(dataItems);

            }else{
                mDataItems = dataItems;

            }
            return self;
        });

        self.events.declare("setOnSelected", function (listener) {
            onSelected = listener;
            return self;
        });
        self.events.declare("getSelectedIndex", function (listener) {
            return mDataPosition;
        });

        self.events.declare("getSelected", function (listener) {
            return mDataSelecting;
        });
        self.events.declare("setSelectedIndex", function (index) {
            mDataPosition = index;
            if (mDataItems.size() || mDataItems.length > index) {
                mDataSelecting = mDataItems instanceof Array ? mDataItems[index] : mDataItems.get(index);
            }
        });

        self.events.declare("showSelection", function () {
            self.callClick();
        });

        self.events.declare("setShowFromView", function (view) {
            mShowFromView = view;
            return self;
        });


        dh.IOUtil.centerInParent(self);
        return self;
    },
    checkbox: function () {
        //var isChecked = false;
        //var self = extentView.iconButton("check_box_outline_blank");
        //self.setOnClick(function (view) {
        //    isChecked = !isChecked;
        //    if (isChecked) {
        //        isChecked
        //    } else {

        //    }
        //});
        var self = dh.IO.checkbox();
        self.getIcon().float("none").TextColor(ggColors.Grey.g700);
        return self;
    },
    viewPassword: function () {

        var m_listener = {
            onConfirmed: null,
            onCancelled: null,
        }

        var self = dh.IO.block().radius(4);
        var lb_title = extentView.textView(in_app_strings.confirm_password).bold().setBottom(5).setTop(2).setLeft("2%").setTextSize(dhSize.textView.textSize).setTextColor(ggColors.Grey.g700);
        var line = dh.IO.block("100%").float("left").boxSizing("border-box").background(ggColors.White).radius(4).setTop(10);
        var txt_password = extentView.editText("", "").borderBottom(0, color.TRANSPARENT);
        txt_password.width("100%").PaddingTop(12).PaddingBottom(12).setTextSize(dhSize.textView.textSize);
        txt_password.setHint("Nhập mật khẩu");
        var btn_signin = extentView.button("Đăng nhập").PaddingTop(12).PaddingBottom(12).PaddingLeft(10).PaddingRight(10).setTop(10).float("right").setTextSize(dhSize.textView.textSize).bold();
        btn_signin.setIcon("send").setIconColor(ggColors.White).getIcon().float("right").setLeft(5).borderLeft(1, ggColors.Grey.g200).PaddingLeft(5);
        btn_signin.background(ggColors.Blue_Grey.g500).radius(4).setTextColor(ggColors.White);

        var icon = extentView.iconButton("lock", dhSize.icon.bigSize).setIconColor(ggColors.Grey.g600)
            .toLeftParent().toTopParent().toBottomParent().setTop(5).setBottom(5).borderRight(1, ggColors.Grey.g400).PaddingLeft(10).PaddingRight(10);
        line.addView(icon).addView(txt_password);
        txt_password.isPassword();

        var btn_confirm = extentView.button("Ok").background(ggColors.Green.g500).setTextColor(ggColors.White).bold().float("right").radius(4).setTextSize(dhSize.textView.textSize)
            .PaddingLeft(12).PaddingRight(12).PaddingTop(10).PaddingBottom(10).minWidth("20%").setTop(16).setBottom(8).setRight(8);
        var btn_cancel = extentView.button(in_app_strings.exit).background(ggColors.Red.g500).setTextColor(ggColors.White).bold().float("right").radius(4).setTextSize(dhSize.textView.textSize)
            .PaddingLeft(12).PaddingRight(12).PaddingTop(10).PaddingBottom(10).minWidth("20%").setTop(16).setBottom(8).setRight(8);

        self.addView(lb_title).addView(line).addView(btn_confirm).addView(btn_cancel);

        txt_password.focus();

        icon.events.override.onMeasured(function (view, width, height) {
            txt_password.PaddingLeft(width + 5);
        });

        txt_password.setOnEnterKey(function (view) {
            btn_confirm.callClick();
        });

        btn_confirm.setOnClick(function (view) {
            if (m_listener.onConfirmed != null) {
                m_listener.onConfirmed(CryptoJS.MD5(txt_password.getText().trim()).toString());
            }
        });

        btn_cancel.setOnClick(function (view) {
            if (m_listener.onCancelled != null) {
                m_listener.onCancelled();
            }
        });

        self.events.declare("setOnConfirmed", function (listener) {
            m_listener.onConfirmed = listener;
        });
        self.events.declare("setOnCancelled", function (listener) {
            m_listener.onCancelled = listener;
        });
        return self;
    },
    viewGuideInputCard: function () {
        var self = dh.IO.block();
        var imv_card = dh.IO.circleImageView();
    },
    viewDatePicker: function (text, value) {
        var self = extentView.viewInputText(text, value);

        var picked_date = new Date();
        var sticky;

        var show_date_picker = function () {
            if (sticky != null) {
                return;
            }
            sticky = dh.IO.sticky(self).radius(4).shadow("rgba(0,0,0,0.5)", 0, 0, 8, false);
            var datePicker = dh.IO.datePickerV2(new Date(1950, 1, 1), new Date()).radius(4);

            sticky.setWidth(self.getWidth());
            sticky.minHeight(20);
            sticky.show();
            sticky.addView(datePicker);
            datePicker.setOnDatePicked(function (day, month, year) {
                self.setText(dh.Util.formatDate(day, month + 1, year, "dd/MM/yyyy"));
                sticky.dismiss();
                picked_date.setDate(day);
                picked_date.setMonth(month);
                picked_date.setFullYear(year);
            });
            sticky.events.override.onDestroy(function () {
                sticky = null;
            });
            sticky.events.override.onCreated(function () {
                sticky.postDelay(function () {
                    datePicker.setFocusingDate(picked_date.getDate(), picked_date.getMonth(), picked_date.getFullYear());
                }, self.getAnimationDuration() + 10);
            })
        }

        if (isMobile.any()) {
            self.editText.setEnable(false);
            self.setOnClick(function (view) {
                show_date_picker();
            });
        } else {
            self.editText.setOnFocusChange(function (view, hasFocus) {
                if (hasFocus) {
                    show_date_picker();
                }
            });
        }


        self.events.declare("getDate", function () {
            return picked_date
        });

        self.events.declare("getDateAsString", function () {
            return dh.Util.formatDate(day, month + 1, year, "dd/MM/yyyy")
        });
        return self;
    },
    viewCombobox: function (text, value) {
        var self = extentView.viewInputText(text, value);

        var renderView;
        var onSelectedItem;

        var show_combobox = function () {
            var sticky_gender = dh.IO.sticky(view).setWidth(view.control.offsetWidth);
            sticky_gender.show();

            var list_view = dh.IO.listViewV2().width("100%");
            var adapter = new dh.AdapterV2(in_app_array_string.genders);
            list_view.unlockLimitRender(true);
            adapter.setView(function (dataItem, position, convertView) {
                convertView = extentView.textView(dataItem).PaddingTop(8).PaddingBottom(8).float("left")
                    .setLeft("5%").setTextColor(ggColors.Grey.g700);
                return convertView;
            });
            list_view_gender.setOnItemClickListener(function (v, dataItem, position) {
                view.setText(dataItem);
                txt_gender.setTag(position + 1);
                sticky_gender.dismiss();
            });
            list_view_gender.setDhAdapter(adapter_gender);
            sticky_gender.addView(list_view_gender);
        }

        txt_gender.setOnClick(function (view) {

        });
        return self;
    },
    calendarPickerLayout: function (width, height) {
        var s_listener = {
            onDateTypeChanged: null,
            onDatePicked: null
        }

        var self = dh.IO.bannerLayout(width, height);

        var pn_banner = dh.IO.block().width("100%")
            .PaddingTop(60).PaddingBottom(60);
        self.getBannerPanel().background(extentView.config.main_color.g500);

        var focusing_date = new Date();

        var lb_year = extentView.textView(focusing_date.getFullYear()).width("100%")
            .setTextSize(dhSize.textView.textSize_large).setTextColor("rgba(255,255,255,0.8)");

        var lb_month_name = extentView.textView(dhArrays.month_names[focusing_date.getMonth()]).width("100%").setBottom(10)
            .setTextSize(dhSize.textView.textSize_larger * 1.5).setTextColor("rgba(255,255,255,0.8)");

        var btn_next_month = extentView.iconButton("keyboard_arrow_right", dhSize.icon.bigx2).toTopParent().toRightParent().toBottomParent().setTop("30%").setBottom("30%")
            .PaddingLeft(15).PaddingRight(15).setIconColor("rgba(255,255,255,0.9)");

        var btn_pev_month = extentView.iconButton("keyboard_arrow_left", dhSize.icon.bigx2).toTopParent().toLeftParent().toBottomParent().setTop("30%").setBottom("30%")
            .PaddingLeft(15).PaddingRight(15).setIconColor("rgba(255,255,255,0.9)");

        var pn_content = dh.IO.block("100%").minHeight(35).float("left");
        var date_picker = dh.IO.datePickerV2(new Date(), new Date());
        date_picker.setHeaderTextColor("rgba(255,255,255,0.9");

        var btn_arrow = dh.IO.floatingActionButton("keyboard_arrow_up").background(ggColors.White).setIconColor(extentView.config.main_color.g500)
            .toRightParent().toBottomParent().setRight(10).setBottom(10);


        var temp_date = new Date();
        temp_date.setTime(focusing_date.getTime());

        function reloadUI() {
            lb_month_name.setText(dhArrays.month_names[focusing_date.getMonth()]);
            lb_year.setText(focusing_date.getFullYear());
            if (focusing_date.getMonth() != date_picker.getMonth() || focusing_date.getFullYear() != date_picker.getYear()) {
                date_picker.setFocusingDate(focusing_date.getDate(), focusing_date.getMonth(), focusing_date.getFullYear());
            }

        }
        reloadUI();

        pn_content.addView(date_picker);

        pn_banner
            .addView(lb_month_name)
            .addView(lb_year)
            .addView(btn_pev_month)
            .addView(btn_next_month);

        self.getBannerPanel().addView(pn_banner);
        self.getMainContentPanel().addView(pn_content);
        self.addView(btn_arrow);
        date_picker.events.override.onCreated(function (v) {
            v.getChildObjectAtIndex(0).moveTo(self.getActionBarPanel()).background(extentView.config.main_color.g500);
            console.log("action bar height", self.getActionBarPanel().getHeight());
            self.getActionBarPanel().requestLayout();
        });
        date_picker.opacity(0.3);
        btn_arrow.getIcon().setRotate(0).setTransitionAll(".4");
        //btn_arrow.setTransitionAll(".2");
        btn_arrow.background(extentView.config.main_color.g500).setIconColor(ggColors.White);
        self.setOnBannerChanged(function (view, hasShown) {
            if (hasShown) {
                date_picker.opacity(0.3);
                btn_arrow.setIcon("keyboard_arrow_up");
                btn_arrow.getIcon().setRotate(0);
                btn_arrow.background(extentView.config.main_color.g500).setIconColor(ggColors.White);
                btn_arrow.setTag(true);
            } else {
                date_picker.opacity(1);
                btn_arrow.setTag(false);
                btn_arrow.background(ggColors.White).setIconColor(extentView.config.main_color.g500);
                btn_arrow.setIcon("add");
                btn_arrow.getIcon().setRotate(-45);
            }
            if (s_listener.onDateTypeChanged != null) {
                s_listener.onDateTypeChanged(self, hasShown);
            }
        });
        self.setHideScrollBar(true);
        btn_arrow.setTag(true);
        btn_arrow.setOnClick(function (view) {
            if (view.getTag()) {
                self.setSmoothScrollY(self.getScrollHeight() - self.getHeight(), 50);
            } else {
                self.setSmoothScrollY(0, 50);
            }
        });

        /* Declare the event when need using as Month view or day view 
                Parameters:
                    view - self,
                    boolean - true: view as Month, false: view as date
        */
        self.events.declare("setOnDateTypeChanged", function (listener) {
            s_listener.onDateTypeChanged = listener;
        });

        lb_month_name.setOnClick(function (view) {
            console.log("h: " + self.control.offsetHeight);
            //var stick_month = dh.IO.sticky(self).setWidth(self.control.offsetWidth).setHeight(self.control.offsetHeight).radius(4).background(ggColors.Blue_Grey.g500);
            //var stick_month = self.showQuicklyLayout().setLeft(8).setRight(8).setBottom(8).radius(4).setTop("30%");
            var stick_month = self.showQuicklyLayout().setLeft(0).setRight(0).setBottom(0).radius(0).setTop("0%");
            var adapter = new dh.AdapterV2(dhArrays.month_names);
            //stick_month.setGravity(define.Gravity.TOP_LEFT);
            adapter.setColumn(3);
            adapter.setView(function (dataItem, position, convertView) {
                convertView = extentView.textView(dataItem).width("100%").textAlign("center").PaddingTop(20).PaddingBottom(20)
                    .setTextSize(dhSize.textView.textSize).setTextColor(ggColors.Grey.g700);

                return convertView;
            });
            var listview = dh.IO.gridViewV3().toFillParent().setTop(15);
            listview.setDhAdapter(adapter);


            stick_month.addView(listview).show();
            var btn_close = dh.IO.floatingActionButton("close").toRightParent().toBottomParent().background(ggColors.Blue.g500).setRight(10).setBottom(10);

            stick_month.addView(btn_close);

            listview.setOnItemClickListener(function (view, dataItem, position) {
                focusing_date.setMonth(position);
                reloadUI();
                stick_month.dismiss();
                callPickedListener();
            });
            btn_close.setOnClick(function () {
                stick_month.dismiss();
            });
        });
        btn_next_month.setOnClick(function (view) {
            focusing_date.setDate(1);
            focusing_date.setMonth(focusing_date.getMonth() + 1);
            reloadUI();
            callPickedListener();
        });
        btn_pev_month.setOnClick(function (view) {
            focusing_date.setDate(1);
            focusing_date.setMonth(focusing_date.getMonth() - 1);
            reloadUI();
            callPickedListener();

        });

        date_picker.setOnDatePicked(function (day, month, year) {
            focusing_date.setDate(day);
            focusing_date.setMonth(month);
            focusing_date.setFullYear(year);
            reloadUI();
            callPickedListener();
        });

        function callPickedListener() {
            if (s_listener.onDatePicked != null) {
                s_listener.onDatePicked(focusing_date.getDate(), focusing_date.getMonth(), focusing_date.getFullYear());
            }
        }

        self.events.declare("setOnDatePicked", function (listener) {
            s_listener.onDatePicked = listener;
        });

        self.events.declare("getSelectedDate", function () {
            return focusing_date;
        });
        self.events.declare("showDayPicker", function () {
            if (btn_arrow.getTag()) {
                btn_arrow.callClick();
            }
        });


        self.events.declare("showMonthPicker", function () {
            if (!btn_arrow.getTag()) {
                btn_arrow.callClick();
            }
        });

        return self;
    },
    calendarDayPickerLayout: function (width, height) {

        var s_listener = {
            onDateTypeChanged: null,
            onDatePicked: null
        }
        var self = dh.IO.bannerLayout(width, height);

        var pn_banner = dh.IO.block().width("100%")
            .PaddingTop(50).PaddingBottom(50);
        self.getBannerPanel().background(extentView.config.main_color.g500);

        var focusing_date = new Date();
        var tem

        var lb_day_name = extentView.textView(dhArrays.day_in_week_full_name[focusing_date.getDay()]).width("100%")
            .setTextSize(dhSize.textView.textSize_larger).setTextColor("rgba(255,255,255,0.7)");

        var lb_day = extentView.textView(focusing_date.getDate()).width("100%").setTop(10)
            .setTextSize(dhSize.textView.textSize_larger * 1.8).setTextColor("rgba(255,255,255,1)");

        var lb_month_year = extentView.textView(dhArrays.month_names[focusing_date.getMonth() + ", " + focusing_date.getFullYear()]).width("100%").setTop(10)
            .setTextSize(dhSize.textView.textSize).setTextColor("rgba(255,255,255,0.7)");

        var btn_next_day = extentView.iconButton("keyboard_arrow_right", dhSize.icon.bigx2).toTopParent().toRightParent().toBottomParent().setTop("30%").setBottom("30%")
            .PaddingLeft(15).PaddingRight(15).setIconColor("rgba(255,255,255,0.9)");
        var btn_pev_day = extentView.iconButton("keyboard_arrow_left", dhSize.icon.bigx2).toTopParent().toLeftParent().toBottomParent().setTop("30%").setBottom("30%")
            .PaddingLeft(15).PaddingRight(15).setIconColor("rgba(255,255,255,0.9)");

        var pn_content = dh.IO.block("100%").minHeight(35).float("left");
        var date_picker = dh.IO.datePickerV2(new Date(), new Date());
        date_picker.setHeaderTextColor("rgba(255,255,255,0.9");

        var btn_arrow = dh.IO.floatingActionButton("keyboard_arrow_up").background(ggColors.White).setIconColor(extentView.config.main_color.g500)
            .toRightParent().toBottomParent().setRight(10).setBottom(10);

        var temp_date = new Date();
        temp_date.setTime(focusing_date.getTime());

        function reloadUI() {
            var currentDate = new Date();
            var isToday = false;
            if (currentDate.getDate() == focusing_date.getDate() && currentDate.getMonth() == focusing_date.getMonth() && currentDate.getFullYear() == focusing_date.getFullYear()) {
                isToday = true;
            }

            lb_day_name.setText(isToday
                ? ("Hôm nay, " + dhArrays.day_in_week_full_name[focusing_date.getDay()].toLowerCase())
                : ("" + dhArrays.day_in_week_full_name[focusing_date.getDay()]));
            lb_day.setText(focusing_date.getDate());
            lb_month_year.setText(dhArrays.month_names[focusing_date.getMonth()] + ", " + focusing_date.getFullYear());
            if (focusing_date.getMonth() != date_picker.getMonth() || focusing_date.getFullYear() != date_picker.getYear()) {
                date_picker.setFocusingDate(focusing_date.getDate(), focusing_date.getMonth(), focusing_date.getFullYear());
            }
            if (s_listener.onDatePicked != null && temp_date.getTime() != focusing_date.getTime()) {
                s_listener.onDatePicked(focusing_date.getDate(), focusing_date.getMonth(), focusing_date.getFullYear());
            }
            temp_date.setTime(focusing_date.getTime());
        }
        reloadUI();

        pn_content.addView(date_picker);

        pn_banner
            .addView(lb_day_name)
            .addView(lb_day)
            .addView(lb_month_year)
            .addView(btn_pev_day)
            .addView(btn_next_day);
        self.getBannerPanel().addView(pn_banner);
        self.getMainContentPanel().addView(pn_content);
        self.addView(btn_arrow);
        date_picker.events.override.onCreated(function (v) {
            v.getChildObjectAtIndex(0).moveTo(self.getActionBarPanel()).background(extentView.config.main_color.g500).PaddingTop(8).PaddingBottom(8);
            self.getActionBarPanel().requestLayout();

        });
        date_picker.opacity(0.3);
        btn_arrow.getIcon().setRotate(0).setTransitionAll(".4");
        //btn_arrow.setTransitionAll(".2");
        btn_arrow.background(extentView.config.main_color.g500).setIconColor(ggColors.White);
        date_picker.setEnable(false);
        self.setOnBannerChanged(function (view, hasShown) {
            if (hasShown) {
                date_picker.opacity(0.3);
                //btn_arrow.setIcon("keyboard_arrow_up");
                btn_arrow.setIcon("keyboard_arrow_up");
                btn_arrow.getIcon().setRotate(0);
                btn_arrow.background(extentView.config.main_color.g500).setIconColor(ggColors.White);
                btn_arrow.setTag(true);
                reloadUI();
            } else {
                date_picker.opacity(1);
                btn_arrow.setTag(false);
                btn_arrow.background(ggColors.White).setIconColor(extentView.config.main_color.g500);
                btn_arrow.setIcon("add");
                btn_arrow.getIcon().setRotate(-45);
                //btn_arrow.setIcon("keyboard_arrow_down");
            }
            date_picker.setEnable(!hasShown);
        });
        self.setHideScrollBar(true);
        btn_arrow.setTag(true);
        btn_arrow.setOnClick(function (view) {
            if (view.getTag()) {
                self.setSmoothScrollY(self.getScrollHeight() - self.getHeight(), 120);
            } else {
                self.setSmoothScrollY(0, 120);
            }
        });

        btn_next_day.setOnClick(function (view) {
            focusing_date.setDate(focusing_date.getDate() + 1);
            reloadUI();
        });
        btn_pev_day.setOnClick(function (view) {
            focusing_date.setDate(focusing_date.getDate() - 1);
            reloadUI();
        });

        date_picker.setOnDatePicked(function (day, month, year) {
            focusing_date.setDate(day);
            focusing_date.setMonth(month);
            focusing_date.setFullYear(year);

            reloadUI();
        });


        self.events.declare("setOnDatePicked", function (listener) {
            s_listener.onDatePicked = listener;
        });

        self.events.declare("getSelectedDate", function () {
            return focusing_date;
        });

        self.events.declare("getSelectedDate", function () {
            return focusing_date;
        });

        self.events.declare("showDayPicker", function () {
            if (btn_arrow.getTag()) {
                btn_arrow.callClick();
            }
        });


        self.events.declare("showMonthPicker", function () {
            if (!btn_arrow.getTag()) {
                btn_arrow.callClick();
            }
        });

        return self;
    },
    takePicture: function () {
        var s_listener = {
            onTakePicture: null
        }
        var self = dh.IO.popup().width(60).height(70).radius(5);
        var imv_screen = dh.IO.circleImageView().toFillParent().setLeft(10).setRight(10).setBottom(10).setTop(10).radius(5);

        var btn_take = dh.IO.iconButton("camera", dhSize.icon.bigx2 + 6).height(6.5).setBottom(15);
        btn_take.setIconColor("rgba(255,255,255,0.8)").setWidth(btn_take.getHeight()).radius(btn_take.getHeight() / 2).background("rgba(0,0,0,0.5)");
        btn_take.toBottomParent().toRightParent().setRight("48%");

        self.addView(imv_screen).addView(btn_take);
        var hasTaken = true;
        var last_image = null;
        var thread = dh.Thread.create(function (thr) {
            if (hasTaken) {
                hasTaken = false;
                dbUtils.realTimeViewer(function (encode) {
                    last_image = encode;
                    hasTaken = true;
                    imv_screen.setBase64Image(last_image);
                });
            }
        }, 100);
        self.events.override.onDestroy(function () {
            thread.remove();
        });

        btn_take.setOnClick(function (view) {
            thread.pause();
            if (last_image != null) {
                if (s_listener.onTakePicture != null) {
                    s_listener.onTakePicture(last_image);
                }
                self.dismiss();
            } else {
                dbUtils.realTimeViewer(function (encode) {
                    if (s_listener.onTakePicture != null) {
                        s_listener.onTakePicture(encode);
                    }
                    self.dismiss();
                });
            }
        });

        self.events.declare("setOnTakePicture", function (listener) {
            s_listener.onTakePicture = listener;
        });

        self.showPopup();
        return self;
    },
    group_confirm_cancel: function () {
        var s_listener = {
            onConfirmed: null,
            onCancelled: null
        }
        var self = dh.IO.block();
        var btn_confirm = extentView.button(in_app_strings.save).background(ggColors.Green.g500).setTextColor(ggColors.White);
        btn_confirm.PaddingLeft(20).PaddingRight(20).PaddingTop(10).PaddingBottom(10).bold().float("right").radius(4);

        var btn_cancel = extentView.button(in_app_strings.cancel).background(ggColors.Red.g500).setTextColor(ggColors.White);
        btn_cancel.PaddingLeft(20).PaddingRight(20).PaddingTop(10).PaddingBottom(10).bold().float("right").radius(4).setRight(5);

        self.addView(btn_confirm).addView(btn_cancel);

        btn_confirm.setOnClick(function (view) {
            if (s_listener.onConfirmed != undefined)
                s_listener.onConfirmed(self);
        });

        btn_cancel.setOnClick(function (view) {
            if (s_listener.onCancelled != undefined)
                s_listener.onCancelled(self);
        });

        self.events.declare("setOnConfirmed", function (listener) {
            s_listener.onConfirmed = listener;
        });

        self.events.declare("setOnCancelled", function (listener) {
            s_listener.onCancelled = listener;
        });

        return self;
    },
    signInBox: function () {

        var s_config = {
            onSigned: null
        }

        var self = info.BODY.showQuicklyLayout().setLeft("35%").setRight("35%").setTop("30%").setBottom("auto").background(ggColors.Blue_Grey.g100).radius(4);
        var container = dh.IO.block().Padding(15);

        var lb_title = extentView.textView("Đăng nhập").setTextSize(dhSize.textView.textSize).setTextColor(ggColors.Blue_Grey.g400);
        var line = dh.IO.block("100%").float("left").boxSizing("border-box").background(ggColors.White).radius(4).setTop(10);
        var txt_password = extentView.editText("", "").borderBottom(0, color.TRANSPARENT);
        txt_password.width("100%").PaddingTop(12).PaddingBottom(12).setTextSize(dhSize.textView.textSize);
        txt_password.setHint("Nhập mật khẩu");
        var btn_signin = extentView.button("Đăng nhập").PaddingTop(12).PaddingBottom(12).PaddingLeft(10).PaddingRight(10).setTop(10).float("right").setTextSize(dhSize.textView.textSize).bold();
        btn_signin.setIcon("send").setIconColor(ggColors.White).getIcon().float("right").setLeft(5).borderLeft(1, ggColors.Grey.g200).PaddingLeft(5);
        btn_signin.background(ggColors.Blue_Grey.g500).radius(4).setTextColor(ggColors.White);

        var icon = extentView.iconButton("lock", dhSize.icon.bigSize).setIconColor(ggColors.Grey.g600)
            .toLeftParent().toTopParent().toBottomParent().setTop(5).setBottom(5).borderRight(1, ggColors.Grey.g400).PaddingLeft(10).PaddingRight(10);
        self.preventTouchOutside();
        line.addView(icon).addView(txt_password);
        txt_password.isPassword();
        container.addView(lb_title)
            .addView(line)
            .addView(btn_signin);

        icon.events.override.onMeasured(function (view, width, height) {
            txt_password.PaddingLeft(width + 5);
        });

        self.addView(container);


        self.events.declare("setOnSigned", function (listener) {
            s_config.onSigned = listener;
        });

        btn_signin.setOnClick(function (view) {
            console.log(s_config);
            if (s_config.onSigned != null) {
                s_config.onSigned(CryptoJS.MD5(txt_password.getText().trim()).toString());
            }
        });
        txt_password.events.override.onCreated(function (view) {
            view.postDelay(function () { view.focus() }, 200);
        });
        txt_password.setOnEnterKey(function (view) {
            btn_signin.callClick();
        });
        return self;
    },
    confirmDialog: function (message, onConfirmed, onCancelled) {
        var self = dh.IO.popup().width(25).Padding(10).radius(4).background(ggColors.Blue_Grey.g50);

        var lb_title = extentView.textView("Xác nhận").setTextSize(dhSize.textView.textSize_large).setTextColor(ggColors.Grey.g600);
        var lb_message = extentView.textView(message).setTop(5).setBottom(10).width("96%").setLeft("2%").PaddingTop(10).PaddingBottom(10).setTextSize(dhSize.textView.textSize)
            .textAlign("left").setTextColor(ggColors.Grey.g700);

        var view_confirm = extentView.group_confirm_cancel().float("right");

        self.addView(lb_title)
            .addView(lb_message)
            .addView(view_confirm);

        view_confirm.setOnConfirmed(function () {
            if (onConfirmed != undefined) {
                onConfirmed(self);
            }
        });
        view_confirm.setOnCancelled(function () {
            if (onCancelled != undefined) {
                onCancelled(self);
            }
        });
        self.preventTouchOutside();

        view_confirm.getChildObjectAtIndex(0).setText("Đồng ý");
        return self;

    },
    authenticationDialog: function (message, onConfirmed, onCancelled, parentView) {
        var self;
        if (parentView == undefined) {
            var self = dh.IO.popup().width(25).Padding(10).radius(4).background(ggColors.Blue_Grey.g50);
        } else {
            self = parentView.showQuicklyLayout().setLeft("10%").setRight("10%").setTop("30%").setBottom("auto").Padding(10).radius(4).background(ggColors.Blue_Grey.g50);;
        }

        var view_confirm = extentView.viewPassword().width("100%");

        self
            .addView(view_confirm);

        view_confirm.setOnConfirmed(function (md5_pass) {
            if (onConfirmed != undefined) {
                onConfirmed(self, md5_pass);
            }
        });
        view_confirm.setOnCancelled(function () {
            if (onCancelled != undefined) {
                onCancelled(self);
            }
        });

        view_confirm.getChildObjectAtIndex(0).setText(message);
        self.preventTouchOutside();

        return self;
    },
}