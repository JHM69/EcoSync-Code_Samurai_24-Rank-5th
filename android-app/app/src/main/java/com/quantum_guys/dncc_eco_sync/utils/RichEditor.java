package com.quantum_guys.dncc_eco_sync.utils;

import static android.view.Gravity.LEFT;
import static android.view.Gravity.RIGHT;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class RichEditor extends WebView {

    private static final String SETUP_HTML = "file:///android_asset/editor.html";
    private static final String CALLBACK_SCHEME = "re-callback://";
    private static final String STATE_SCHEME = "re-state://";
    private boolean isReady = false;
    private String mContents;
    private OnTextChangeListener mTextChangeListener;
    private OnDecorationStateListener mDecorationStateListener;
    private AfterInitialLoadListener mLoadListener;

    public RichEditor(Context context) {
        this(context, null);
    }

    public RichEditor(Context context, AttributeSet attrs) {
        this(context, attrs, android.R.attr.webViewStyle);
    }

    @SuppressLint({"SetJavaScriptEnabled", "ObsoleteSdkInt"})
    public RichEditor(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            this.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            this.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
        this.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);
        getSettings().setJavaScriptEnabled(true);
        getSettings().setDisplayZoomControls(false);
        getSettings().setSupportZoom(false);
        this.setVerticalScrollBarEnabled(false);
        this.setHorizontalScrollBarEnabled(false);
        setWebChromeClient(new WebChromeClient());
        setWebViewClient(createWebviewClient());
        loadUrl(SETUP_HTML);

        applyAttributes(context, attrs);
    }

    protected EditorWebViewClient createWebviewClient() {
        return new EditorWebViewClient();
    }

    public void setOnTextChangeListener(OnTextChangeListener listener) {
        mTextChangeListener = listener;
    }

    public void setOnDecorationChangeListener(OnDecorationStateListener listener) {
        mDecorationStateListener = listener;
    }

    public void setOnInitialLoadListener(AfterInitialLoadListener listener) {
        mLoadListener = listener;
    }

    private void callback(String text) {
        Log.d("TEXT::::::::", text);
        mContents = text.replaceFirst(CALLBACK_SCHEME, "");
        if (mTextChangeListener != null) {
            mTextChangeListener.onTextChange(mContents);
        }
        Log.d("mContents::::::::", mContents);
    }

    private void stateCheck(String text) {
        String state = text.replaceFirst(STATE_SCHEME, "").toUpperCase(Locale.ENGLISH);
        List<Type> types = new ArrayList<>();
        for (Type type : Type.values()) {
            if (TextUtils.indexOf(state, type.name()) != -1) {
                types.add(type);
            }
        }
        ///android_asset/prettify/prettify.js
        if (mDecorationStateListener != null) {
            mDecorationStateListener.onStateChangeListener(state, types);
        }
    }

    @SuppressLint("RtlHardcoded")
    private void applyAttributes(Context context, AttributeSet attrs) {
        final int[] attrsArray = new int[]{
                android.R.attr.gravity
        };
        TypedArray ta = context.obtainStyledAttributes(attrs, attrsArray);

        int gravity = ta.getInt(0, NO_ID);
        switch (gravity) {
            case LEFT:
                exec("javascript:RE.setTextAlign(\"left\")");
                break;
            case RIGHT:
                exec("javascript:RE.setTextAlign(\"right\")");
                break;
            case Gravity.TOP:
                exec("javascript:RE.setVerticalAlign(\"top\")");
                break;
            case Gravity.BOTTOM:
                exec("javascript:RE.setVerticalAlign(\"bottom\")");
                break;
            case Gravity.CENTER_VERTICAL:
                exec("javascript:RE.setVerticalAlign(\"middle\")");
                break;
            case Gravity.CENTER_HORIZONTAL:
                exec("javascript:RE.setTextAlign(\"center\")");
                break;
            case Gravity.CENTER:
                exec("javascript:RE.setVerticalAlign(\"middle\")");
                exec("javascript:RE.setTextAlign(\"center\")");
                break;
        }
        ta.recycle();
    }

    @SuppressLint("LongLogTag")
    public String getHtml() {
        return mContents;
    }

    public void setHtml(String contents) {
        if (contents == null) {
            contents = "";
        }
        try {
            exec("javascript:RE.setHtml('" + URLEncoder.encode(contents, "UTF-8") + "');");
        } catch (UnsupportedEncodingException e) {
            // No handling
        }
        mContents = contents;
    }

    public void setEditorFontColor(int color) {
        String hex = convertHexColorString(color);
        exec("javascript:RE.setBaseTextColor('" + hex + "');");
    }

    public void setEditorFontSize(int px) {
        exec("javascript:RE.setBaseFontSize('" + px + "px');");
    }

    @Override
    public void setPadding(int left, int top, int right, int bottom) {
        super.setPadding(left, top, right, bottom);
        exec("javascript:RE.setPadding('" + left + "px', '" + top + "px', '" + right + "px', '" + bottom
                + "px');");
    }

    @Override
    public void setPaddingRelative(int start, int top, int end, int bottom) {
        // still not support RTL.
        setPadding(start, top, end, bottom);
    }

    public void setEditorBackgroundColor(int color) {
        setBackgroundColor(color);
    }

    @Override
    public void setBackgroundColor(int color) {
        super.setBackgroundColor(color);
    }

    @Override
    public void setBackgroundResource(int resid) {
        Bitmap bitmap = Utils.decodeResource(getContext(), resid);
        String base64 = Utils.toBase64(bitmap);
        bitmap.recycle();

        exec("javascript:RE.setBackgroundImage('url(data:image/png;base64," + base64 + ")');");
    }

    @Override
    public void setBackground(Drawable background) {
        Bitmap bitmap = Utils.toBitmap(background);
        String base64 = Utils.toBase64(bitmap);
        bitmap.recycle();

        exec("javascript:RE.setBackgroundImage('url(data:image/png;base64," + base64 + ")');");
    }

    public void setBackground(String url) {
        exec("javascript:RE.setBackgroundImage('url(" + url + ")');");
    }

    public void setEditorWidth(int px) {
        exec("javascript:RE.setWidth('" + px + "px');");
    }

    public void setEditorHeight(int px) {
        exec("javascript:RE.setHeight('" + px + "px');");
    }

    public void setPlaceholder(String placeholder) {
        exec("javascript:RE.setPlaceholder('" + placeholder + "');");
    }

    public void setInputEnabled(Boolean inputEnabled) {
        exec("javascript:RE.setInputEnabled(" + inputEnabled + ")");
    }

    public void loadCSS(String cssFile) {
        String jsCSSImport = "(function() {" +
                "    var head  = document.getElementsByTagName(\"head\")[0];" +
                "    var link  = document.createElement(\"link\");" +
                "    link.rel  = \"stylesheet\";" +
                "    link.type = \"text/css\";" +
                "    link.href = \"" + cssFile + "\";" +
                "    link.media = \"all\";" +
                "    head.appendChild(link);" +
                "}) ();";
        exec("javascript:" + jsCSSImport + "");
    }

    public void undo() {
        exec("javascript:RE.undo();");
    }

    public void redo() {
        exec("javascript:RE.redo();");
    }

    public void setBold() {
        exec("javascript:RE.setBold();");
    }

    public void setItalic() {
        exec("javascript:RE.setItalic();");
    }

    public void setSubscript() {
        exec("javascript:RE.setSubscript();");
    }

    public void setSuperscript() {
        exec("javascript:RE.setSuperscript();");
    }

    public void setStrikeThrough() {
        exec("javascript:RE.setStrikeThrough();");
    }

    public void setUnderline() {
        exec("javascript:RE.setUnderline();");
    }

    public void setTextColor(int color) {
        exec("javascript:RE.prepareInsert();");
        String hex = convertHexColorString(color);
        exec("javascript:RE.setTextColor('" + hex + "');");
    }

    public void setTextBackgroundColor(int color) {
        exec("javascript:RE.prepareInsert();");
        String hex = convertHexColorString(color);
        exec("javascript:RE.setTextBackgroundColor('" + hex + "');");
    }

    public void setFontSize(int fontSize) {
        if (fontSize > 7 || fontSize < 1) {
            Log.e("RichEditor", "Font size should have a value between 1-7");
        }
        exec("javascript:RE.setFontSize('" + fontSize + "');");
    }

    public void removeFormat() {
        exec("javascript:RE.removeFormat();");
    }

    public void setHeading(int heading) {
        exec("javascript:RE.setHeading('" + heading + "');");
    }

    public void setIndent() {
        exec("javascript:RE.setIndent();");
    }

    public void setOutdent() {
        exec("javascript:RE.setOutdent();");
    }

    public void setAlignLeft() {
        exec("javascript:RE.setJustifyLeft();");
    }

    public void setAlignCenter() {
        exec("javascript:RE.setJustifyCenter();");
    }

    public void setAlignRight() {
        exec("javascript:RE.setJustifyRight();");
    }

    public void setBlockquote() {
        exec("javascript:RE.setBlockquote();");
    }

    public void setBullets() {
        exec("javascript:RE.setBullets();");
    }

    public void setNumbers() {
        exec("javascript:RE.setNumbers();");
    }

    public void setCode(String code) {
        try {
            String codea=code.replaceAll(System.getProperty("line.separator"), "\\\\n");
            exec("javascript:RE.setCode('" + codea + "');");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public void setVideo(String video) {
        try {
            String id = extractYTId(video);
            if (id.length() == 11) {
                exec("javascript:RE.setVideo('" + id + "');");
            }
        }catch (Exception ignored){

        }
    }

    public static String extractYTId(String ytUrl) {
        String vId = null;
        Pattern pattern = Pattern.compile(
                "^https?://.*(?:youtu.be/|v/|u/\\w/|embed/|watch?v=)([^#&?]*).*$",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(ytUrl);
        if (matcher.matches()){
            vId = matcher.group(1);
        }
        return vId;
    }

    public void insertLatex(String latexEquation) {
        latexEquation = "\\(" + latexEquation + "\\)";
        exec("javascript:RE.prepareInsert();");
        try {
            exec("javascript:RE.insertLatex('" + URLEncoder.encode(latexEquation, "UTF-8") + "');");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    public void insertLink(String href, String title) {
        exec("javascript:RE.prepareInsert();");
        exec("javascript:RE.insertLink('" + href + "', '" + title + "');");
    }


    public void insertTodo() {
        exec("javascript:RE.prepareInsert();");
        exec("javascript:RE.setTodo('" + Utils.getCurrentTime() + "');");
    }

    public void focusEditor() {
        requestFocus();
        exec("javascript:RE.focus();");
    }

    public void clearFocusEditor() {
        exec("javascript:RE.blurFocus();");
    }

    private String convertHexColorString(int color) {
        return String.format("#%06X", (0xFFFFFF & color));
    }

    protected void exec(final String trigger) {
        if (isReady) {
            load(trigger);
        } else {
            postDelayed(() -> exec(trigger), 100);
        }
    }

    private void load(String trigger) {
        evaluateJavascript(trigger, null);
    }

    public enum Type {
        BOLD,
        ITALIC,
        SUBSCRIPT,
        SUPERSCRIPT,
        STRIKETHROUGH,
        UNDERLINE,
        H1,
        H2,
        H3,
        H4,
        H5,
        H6,
        ORDEREDLIST,
        UNORDEREDLIST,
        JUSTIFYCENTER,
        JUSTIFYFULL,
        JUSTUFYLEFT,
        JUSTIFYRIGHT
    }

    public interface OnTextChangeListener {
        void onTextChange(String text);
    }

    public interface OnDecorationStateListener {

        void onStateChangeListener(String text, List<Type> types);
    }

    public interface AfterInitialLoadListener {

        void onAfterInitialLoad(boolean isReady);
    }

    protected class EditorWebViewClient extends WebViewClient {
        @Override
        public void onPageFinished(WebView view, String url) {
            isReady = url.equalsIgnoreCase(SETUP_HTML);
            if (mLoadListener != null) {
                mLoadListener.onAfterInitialLoad(isReady);
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            String decode;
            try {
                Log.d("URL::::::::", url);
                url = url.replace("+", " %2b ");
                Log.d("URL::::::::", url);
                decode = URLDecoder.decode(url, "UTF-8");
                Log.d("DECODED::::::::", decode);
            } catch (UnsupportedEncodingException e) {
                // No handling
                return false;
            }

            if (TextUtils.indexOf(url, CALLBACK_SCHEME) == 0) {
                callback(decode);
                return true;
            } else if (TextUtils.indexOf(url, STATE_SCHEME) == 0) {
                stateCheck(decode);
                return true;
            }

            return super.shouldOverrideUrlLoading(view, url);
        }
    }
}
