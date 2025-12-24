import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "./PostWritePage.module.css";
import DashboardHeader from "../../components/header/Header";
import { ROUTES } from "../../utils/constants";
import { useAuthContext } from "../../contexts/AuthContext";
import { createArticle, getArticleById, updateArticle } from "../../api/articles";
const categories = [
  { value: "dog", label: "강아지", icon: "🐶" },
  { value: "cat", label: "고양이", icon: "🐱" },
  { value: "rabbit", label: "토끼", icon: "🐰" },
  { value: "hamster", label: "햄스터", icon: "🐹" },
  { value: "guinea pig", label: "기니피그", icon: "🐭" },
  { value: "bird", label: "조류", icon: "🦜" },
  { value: "fish", label: "어류", icon: "🐟" },
  { value: "reptile", label: "파충류", icon: "🦎" },
  { value: "turtle", label: "거북이", icon: "🐢" },
];
const PostWritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { user, logout } = useAuthContext();
  const isEdit = Boolean(new URLSearchParams(location.search).get("edit"));
  const editId = new URLSearchParams(location.search).get("edit");
  const [selectedCategory, setSelectedCategory] = useState("dog");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleLimit = 100;
  const displayName = user?.name || "집사님";
  useEffect(() => {
    if (isEdit) return; // 수정 모드에서는 초안 대신 서버 데이터 사용
    const saved = localStorage.getItem("community_post_draft");
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedCategory(data.selectedCategory || "dog");
      setTitle(data.title || "");
      setContent(data.content || "");
      setImagePreview(data.imagePreview || "");
    }
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !editId) return;
    const fetchArticle = async () => {
      try {
        const res = await getArticleById(editId);
        const data = res?.data ?? res;
        setSelectedCategory(data?.category || "dog");
        setTitle(data?.title || "");
        setContent(data?.content || "");
        setImagePreview(data?.img_url || "");
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        toast.error(
          err.response?.data?.message ||
            "게시글을 불러오는 중 오류가 발생했습니다.",
          { position: "top-center" }
        );
      }
    };
    fetchArticle();
  }, [isEdit, editId]);
  useEffect(() => {
    localStorage.setItem(
      "community_post_draft",
      JSON.stringify({
        selectedCategory,
        title,
        content,
        imagePreview,
      })
    );
  }, [selectedCategory, title, content, imagePreview]);
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.", {
        position: "top-center",
      });
      return;
    }
    // 파일 객체 저장
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.", { position: "top-center" });
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.", { position: "top-center" });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("category", selectedCategory);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      if (isEdit && editId) {
        await updateArticle(editId, formData);
      } else {
        await createArticle(formData);
      }
      toast.success(
        isEdit ? "게시글이 수정되었습니다! ✨" : "게시글이 등록되었습니다! ✨",
        { position: "top-center" }
      );
      localStorage.removeItem("community_post_draft");
      setTimeout(() => navigate(ROUTES.COMMUNITY), 400);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      toast.error("게시글 저장에 실패했습니다. 다시 시도해주세요.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    toast.custom(
      (t) => (
        <div
          className={`${styles.confirmToast} ${
            t.visible ? styles.toastIn : styles.toastOut
          }`}
        >
          <div className={styles.confirmTitle}>작성을 취소하시겠습니까?</div>
          <div className={styles.confirmMessage}>
            작성 내용이 사라집니다.
          </div>
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={styles.confirmCancel}
              onClick={() => toast.dismiss(t.id)}
            >
              계속 작성
            </button>
            <button
              type="button"
              className={styles.confirmOk}
              onClick={() => {
                toast.dismiss(t.id);
                navigate(ROUTES.COMMUNITY);
              }}
            >
              취소하기
            </button>
          </div>
        </div>
      ),
      { position: "top-center", duration: 4000 }
    );
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };
  return (
    <div className={styles.page}>
      <Toaster position="top-center" />
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />
      <div className={styles.container}>
        <div className={styles.backRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.COMMUNITY)}
          >
            ← 목록으로 돌아가기
          </button>
        </div>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "📝 게시글 수정" : "📝 게시글 작성"}
          </h1>
          <p className={styles.pageSubtitle}>
            {isEdit
              ? "작성한 내용을 수정해 주세요"
              : "다른 집사님들과 소중한 경험을 나눠주세요"}
          </p>
        </header>
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.label}>카테고리</span>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.categoryRow}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`${styles.categoryChip} ${
                      selectedCategory === cat.value ? styles.active : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    <span className={styles.categoryIcon}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <label className={styles.label} htmlFor="title">
                  제목
                </label>
                <span className={styles.required}>*</span>
              </div>
              <input
                id="title"
                type="text"
                className={styles.input}
                placeholder="제목을 입력해주세요 (최대 100자)"
                value={title}
                maxLength={titleLimit}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className={styles.charCounter}>
                <span>{title.length}</span> / {titleLimit}
              </div>
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <label className={styles.label} htmlFor="content">
                  내용
                </label>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                id="content"
                className={styles.textarea}
                placeholder={
                  "내용을 입력하세요\n\n• 다른 집사님들에게 도움이 될 만한 정보를 공유해주세요\n• 반려동물의 건강과 안전에 관한 내용이라면 더욱 좋아요\n• 따뜻하고 존중하는 태도로 작성해주세요"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className={styles.charCounter}>
                <span>{content.length.toLocaleString()}</span>자
              </div>
              <div className={styles.tipBox}>
                <div className={styles.tipTitle}>💡 좋은 게시글 작성 팁</div>
                <ul className={styles.tipList}>
                  <li>
                    구체적인 상황과 경험을 공유하면 더 많은 공감을 얻을 수
                    있어요.
                  </li>
                  <li>사진을 함께 첨부하면 내용 이해가 쉬워져요.</li>
                  <li>
                    질문글이라면 반려동물의 나이, 품종 등 상세 정보를
                    적어주세요.
                  </li>
                </ul>
              </div>
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.label}>이미지 첨부 (선택)</span>
              </div>
              {!imagePreview && (
                <button
                  type="button"
                  className={styles.uploadArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={styles.uploadIcon}>📸</div>
                  <div className={styles.uploadText}>
                    클릭하여 이미지 업로드
                  </div>
                  <div className={styles.uploadHint}>
                    JPG, PNG 파일 (최대 5MB)
                  </div>
                </button>
              )}
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="미리보기" />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={handleRemoveImage}
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </section>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : isEdit ? "수정하기" : "게시하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PostWritePage;
